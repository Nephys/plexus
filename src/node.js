const { EventEmitter } = require("events");

const Contact = require("./contact");
const Item = require("./item");
const Message = require("./message");
const Router = require("./router");
const RPC = require("./rpc");
const Storage = require("./storage");
const VectorClock = require("./vector_clock");

class Node extends EventEmitter {
    constructor({
        host = "127.0.0.1",
        port = 8080,
        id,
        
        
        //  The maximum amount of buckets to be stored in the router
        capacity = 160,             //  (Default: 160)
        //  The maximum amount of contacts to be stored per bucket
        peers = 20,                 //  (Default: 20)


        //  Bucket refresh interval
        refresh = 25000,          //  (Default: 25s)

        //  Item expiration time
        expire = 3600000,           //  (Default: 1h)
        //  Item republishing interval (only for the item publisher)
        republish = 3600000,        //  (Default: 1h)
        //  Data replication interval
        replicate = 3600000         //  (Default: 1h)
    } = {}) {
        super();

        //  Node's own contact information
        this.self = new Contact({
            host:host,
            port: port,

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

        //  Storage
        this.storage = new Storage();

        //  Tasks
        setInterval(this.on_refresh.bind(this), refresh);

        setInterval(this.on_expire.bind(this, expire), expire);
        setInterval(this.on_republish.bind(this, republish), republish);
        setInterval(this.on_replicate.bind(this), replicate);

        //  RPC Message handler
        this.bind_rpc_handlers();
    }


    //  Tasks
    //  Refresh the list of contacts, trying to keep their UDP Hole open
    on_refresh() {
        this.self.clock.update(this.self.id);
        
        let contacts = this.router.contacts;
        contacts.map((c) => {
            let request = new Message({method: "ping", params: {id: this.self.id, time: this.self.clock.time}});
            let handshake = this.rpc.send_message(request, {host: c.host, port: c.port});

            handshake.on("response", (message, {host, port}) => {
                let contact = new Contact({
                    host: host,
                    port: port,
                    id: message.result.id,
                    clock: new VectorClock({start: message.result.time})
                });

                this.router.update_contact(contact);
                this.self.clock.update(contact.id);
            });
        });
    }

    //  Delete expired items
    on_expire(expire) {
        this.self.clock.update(this.self.id);

        let items = this.storage.get_items();
        for (let i = 0; i < items.length; i++){
            let item = items[i];
            if(Date.now() >= item.timestamp + expire) {
                this.storage.delete(item.key);
            }
        }
    }

    //  Republish owned items on the network
    on_republish(republish) {
        this.self.clock.update(this.self.id);

        let items = this.storage.get_republishable_items();
        for (let i = 0; i < items.length; i++){
            let item = new Item({key: items[i].key, value: items[i].value, publisher: items[i].publisher, timestamp: Date.now()});

            if(items[i].publisher == this.self.id && Date.now() >= items[i].timestamp + republish) {
                let contacts = this.router.get_contacts_near(items[i].key, this.router.peers, Buffer.from(this.self.id));
                contacts.map((contact) => {
                    //  Create the request message once per contact to avoid message ID collision when/if awaiting a response
                    let request = new Message({method: "store", params: {item: item, sender: {id: this.self.id, time: this.self.clock.time}}});
                    this.rpc.send_message(request, {host: contact.host, port: contact.port});
                });
            }
        }
    }

    //  Spread items through the network
    on_replicate() {
        this.self.clock.update(this.self.id);

        let items = this.storage.get_items();
        for (let i = 0; i < items.length; i++){
            let item = new Item({key: items[i].key, value: items[i].value, publisher: items[i].publisher, timestamp: Date.now()});

            if (items[i].publisher !== this.self.id) {
                let contacts = this.router.get_contacts_near(items[i].key, this.router.peers, Buffer.from(this.self.id));
                contacts.map((contact) => {
                    //  Create the request message once per contact to avoid message ID collision when/if awaiting a response
                    let request = new Message({method: "store", params: {item: item, sender: {id: this.self.id, time: this.self.clock.time}}});
                    this.rpc.send_message(request, {host: contact.host, port: contact.port});
                });
            }
        }
    }


    //  RPC & Network
    //  Bind RPC requests to their own methods
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
            this.emit("ready");
        });
    }

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
        
        this.storage.set(item.key, item);
    }

    //  Respond to BROADCAST requests by sending the message to every known nodes
    on_broadcast(message, {host, port}) {
        let params = message.params;
        this.self.clock.update(params.sender.id);

        this.emit("broadcast", params.data);

        let sender = new Contact({
            host,
            port,
            id: params.sender.id,
            clock: new VectorClock({start: params.sender.time})
        });

        let recipients = params.contacts;
        recipients.push(sender);

        let list = this.router.contacts.filter((c) => {
            return !recipients.map((r) => {
                return r.id;
            }).includes(c.id);
        });

        let contacts = this.router.contacts.filter((c) => {
            return !recipients.map((r) => {
                return r.id;
            }).includes(c.id);
        });

        list.map((contact) => {
            if(!contact) {
                let response = new Message({result: contacts.concat(recipients), id: message.id});
                this.rpc.send_message(response, {host, port});
            }

            let request = new Message({method: "broadcast", params: {data: params.data, contacts: contacts.concat(recipients), sender:  {id: this.self.id, time: this.self.clock.time}}});
            let handshake = this.rpc.send_message(request, {host: contact.host, port: contact.port});
            
            handshake.on("response", (m, {h, p}) => {
                this.self.clock.update(contact.id);

                recipients = m.result;
                contacts = contacts.filter((c) => {
                    return !recipients.map((r) => {
                        return r.id;
                    }).includes(c.id);
                });
            });
        });
    }


    //  NODE
    //  Find an Item/Node on the network
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
                this.self.clock.update(contact.id);

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

    //  Store data on the network
    store({key, value, republish = false}) {
        this.self.clock.update(this.self.id);
        
        let item = new Item({key: key, value: value, publisher: this.self.id, timestamp: Date.now()});
        this.storage.set(item.key, item, republish);
        
        let contacts = this.router.get_contacts_near(item.key, this.router.peers, Buffer.from(this.self.id));
        contacts.map((contact) => {
            //  Create the request message once per contact to avoid message ID collision when/if awaiting a response
            let request = new Message({method: "store", params: {item: item, sender: {id: this.self.id, time: this.self.clock.time}}});
            this.rpc.send_message(request, {host: contact.host, port: contact.port});
        });

        return item;
    }

    //  Broadcast to the whole network
    broadcast({data}) {
        this.self.clock.update(this.self.id);

        let recipients = [];

        let list = this.router.contacts.filter((c) => {
            return !recipients.map((r) => {
                return r.id;
            }).includes(c.id);
        });

        let contacts = this.router.contacts.filter((c) => {
            return !recipients.map((r) => {
                return r.id;
            }).includes(c.id);
        });

        list.map((contact) => {
            if(!contact) {
                return;
            }

            let request = new Message({method: "broadcast", params: {data, contacts: contacts.concat(recipients), sender:  {id: this.self.id, time: this.self.clock.time}}});
            let handshake = this.rpc.send_message(request, {host: contact.host, port: contact.port});
            
            handshake.on("response", (m, {h, p}) => {
                this.self.clock.update(contact.id);
                
                recipients = m.result;
                contacts = contacts.filter((c) => {
                    return !recipients.map((r) => {
                        return r.id;
                    }).includes(c.id);
                });
            });
        });
    }

    //  Connect to another node
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