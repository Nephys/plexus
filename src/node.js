const { EventEmitter } = require("events");

const Contact = require("./contact");
const Item = require("./item");
const Message = require("./message");
const Router = require("./router");
const RPC = require("./rpc");
const VectorClock = require("./vector_clock");

class Node extends EventEmitter {
    constructor({
        host = "127.0.0.1",
        port = 8080,
        id,

        hash = { algorithm: "sha256", encoding: "hex" },
        
        //  The maximum amount of buckets to be stored in the router
        capacity = 160,             //  (Default: 160)
        //  The maximum amount of contacts to be stored per bucket
        peers = 20,                 //  (Default: 20)


        //  Item expiration time
        expire = 86400000,          //  (Default: 24h)
        //  Bucket refresh interval
        refresh = 3600000,          //  (Default: 1h)
        //  Data replication interval
        replicate = 3600000,        //  (Default: 1h)
        //  Item republishing interval (only for the item publisher)
        republish = 86400000        //  (Default: 24h)
    } = {}) {
        super();

        //TODO
        //  Node's own contact information
        this.self = new Contact({
            host:host,
            port: port,

            hash: hash,

            id: id
        });
        
        //  Remote Procedure Calls
        this.rpc = new RPC({
            port: port
        });

        //  Network router keeping the network structured
        this.router = new Router({
            contact: this.self,
            rpc: this.rpc,
            capacity: capacity,
            peers: peers
        });

        //  RPC Message handler
        this.bind_rpc_handlers();

        //  Storage Test
        this.storage = new Map();
    }

    bind_rpc_handlers() {
        let handlers = [
            {"PING": this.on_ping},
            {"FIND": this.on_find},
            {"STORE": this.on_store},
            {"BROADCAST": this.on_broadcast},
        ];

        for (let i = 0; i < handlers.length; i++) {
            this.rpc.on(Object.keys(handlers[i])[0], Object.values(handlers[i])[0].bind(this));
        }

        this.rpc.on("ready", () => {
            // console.log(`node ${this.self.id} listening on ${this.self.name}`);
            this.emit("ready");
        });
    }

    
    //  RPC & Network
    //  Respond to PING requests with the node's ID and logical time
    on_ping(message, {host, port}) {
        let params = message.params;
        
        let contact = new Contact({
            host: host,
            port: port,
            id: params.id,
            clock: new VectorClock({start: params.time})
        });
        this.self.clock.update(contact.id);

        // console.log(`received PING from ${contact.name} with id ${contact.id}`);
        this.router.update_contact(contact);

        let response = new Message({result: {id: this.self.id, time: this.self.clock.time}, id: message.id});
        this.rpc.send_message(response, {host, port});
    }

    //  Respond to FIND requests with the closest nodes possible of hosting the specified data
    on_find(message, {host, port}) {
        let params = message.params;
        this.self.clock.update(params.sender.id);

        let key = params.key;                                //  Buffer
        let limit = this.router.peers;
        let sender = Buffer.from(params.sender.id);         //  Buffer

        //  Check if the key/node is locally stored
        if(this.router.has_contact_id(key)) {
            let response = new Message({result: this.router.get_contact(key), id: message.id});
            this.rpc.send_message(response, {host, port});
        } else if(this.storage.has(key)) {
            let response = new Message({result: this.storage.get(key), id: message.id});
            this.rpc.send_message(response, {host, port});
        } else {
            //  Get a list of the closest known contacts to the key
            let near = this.router.get_contacts_near(key, limit, sender);
            near.map((contact) => {
                //  Create the request message once per contact to avoid message ID collision when/if awaiting a response
                let request = new Message({method: "find", params: {key: key, limit: limit, sender: {id: this.self.id, time: this.self.clock.time}}});
                let handshake = this.rpc.send_message(request, {host: contact.host, port: contact.port});
            
                handshake.on("response", (m, {h, p}) => {
                    let response = new Message({result: m.result, id: message.id});
                    this.rpc.send_message(response, {host, port});
                });
            });
        }
    }

    //  Respond to STORE requests by storing the specified item on the node
    on_store(message, {host, port}) {
        let params = message.params;
        this.self.clock.update(params.sender.id);

        let item = params.item;
        
        //TODO Implement a better storage system
        this.storage.set(item.key, item);
    }

    //  Respond to BROADCAST requests by sendint the message to every known nodes
    on_broadcast(message, {host, port}) {
        let params = message.params;
        this.self.clock.update(params.sender.id);

        //  Notify of the event
        this.emit("broadcast", message);

        let skip = params.list;
        let list = this.router.contacts.map((c) => {
            return c.id;
        }).concat(params.list);

        let request = new Message({method: "broadcast", params: {list, data: params.data, sender: {id: this.self.id, time: this.self.clock.time}}});
        this.router.contacts.map((contact) => {
            if(!skip.includes(contact.id)) {
                this.rpc.send_message(request, {host: contact.host, port: contact.port});
            }
        });

        let contact = new Contact({
            host: host,
            port: port,
            id: params.sender.id,
            clock: new VectorClock({start: params.sender.time})
        });
        this.router.update_contact(contact);
    }


    //  NODE
    find({key}) {
        this.self.clock.update(this.self.id);
        let emitter = new EventEmitter();

        let found = false;
        let timeouts = 0;
        let contacts = this.router.get_contacts_near(key, this.router.peers, Buffer.from(this.self.id));
        contacts.map((contact) => {
            //  Create the request message once per contact to avoid message ID collision when/if awaiting a response
            let request = new Message({method: "find", params: {key: key, limit: this.router.peers, sender: {id: this.self.id, time: this.self.clock.time}}});
            let handshake = this.rpc.send_message(request, {host: contact.host, port: contact.port});

            handshake.on("response", (message, {host, port}) => {
                if(!found) {
                    found = true;
                    emitter.emit("found", message.result);
                }

                handshake.removeAllListeners("ignore");
                handshake.removeAllListeners("timeout");
            });

            let on_rejected = () => {
                timeouts++;
                if(timeouts >= contacts.length){
                    emitter.emit("timeout");
                }
            }

            handshake.on("ignore", on_rejected);
            handshake.on("timeout", on_rejected);
        });

        return emitter;
    }

    store({key, value}) {
        this.self.clock.update(this.self.id);
        
        let item = new Item({key: key, value: value, publisher: this.self.id, hash: this.self.hash});
        
        let contacts = this.router.get_contacts_near(item.key, this.router.peers, Buffer.from(this.self.id));
        contacts.map((contact) => {
            //  Create the request message once per contact to avoid message ID collision when/if awaiting a response
            let request = new Message({method: "store", params: {item: item, sender: {id: this.self.id, time: this.self.clock.time}}});
            this.rpc.send_message(request, {host: contact.host, port: contact.port});
        });
    }

    broadcast({data}) {
        this.self.clock.update(this.self.id);

        //  Get a list of participants
        let list = this.router.contacts.map((c) => {
            return c.id;
        });

        //  Add current node to the list
        list.push(this.self.id);
        
        //  Create a message containing the data and list of participants
        let request = new Message({method: "broadcast", params: {list, data, sender: {id: this.self.id, time: this.self.clock.time}}});

        this.router.contacts.map((contact) => {
            this.rpc.send_message(request, {host: contact.host, port: contact.port});
        });
    }

    connect({host, port}) {
        this.self.clock.update(this.self.id);

        let request = new Message({method: "ping", params: {id: this.self.id, time: this.self.clock.time}});
        let handshake = this.rpc.send_message(request, {host, port});

        handshake.on("response", (message, {host, port}) => {
            let contact = new Contact({
                host: host,
                port: port,
                id: message.result.id,
                clock: new VectorClock({start: message.result.time})
            });

            this.router.update_contact(contact);
            this.self.clock.update(contact.id);
            this.emit("connected", contact);
        });

        return handshake;
    }
}

module.exports = Node;