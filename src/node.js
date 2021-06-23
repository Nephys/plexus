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
        
        capacity = 160,
        peers = 20
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
    }

    bind_rpc_handlers() {
        let handlers = [
            {"PING": this.on_ping},
            {"FIND": this.on_find},
            {"STORE": this.on_store},
        ];

        for (let i = 0; i < handlers.length; i++) {
            this.rpc.on(Object.keys(handlers[i])[0], Object.values(handlers[i])[0].bind(this));
        }

        this.rpc.on("ready", () => {
            console.log(`node ${this.self.id} listening on ${this.self.name}`);
        });
    }

    
    //  RPC
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

        console.log(`received PING from ${contact.name} with id ${contact.id}`);
        this.router.update_contact(contact);

        let response = new Message({result: {id: this.self.id, time: this.self.clock.time}, id: message.id});
        this.rpc.send_message(response, {host, port});
    }

    //  Respond to FIND requests with the closest nodes possible of hosting the specified data
    on_find(message, {host, port}) {
        let params = message.params;
        this.self.clock.update(params.sender.id);

        let key = params.key;                       //  Buffer
        let limit = this.router.peers;
        let sender = params.sender.buffer;          //  Buffer

        let near = this.router.get_contacts_near(key, limit, sender);

        let response = new Message({result: {contacts: near}, id: message.id});
        this.rpc.send_message(response, {host, port});
    }

    //  Respond to STORE requests by storing the specified item on the node
    on_store(message, {host, port}) {
        let params = message.params;
        this.self.clock.update(params.sender.id);

        let item = params.item;
        console.log(require("util").inspect(item, {showHidden: true, depth: Infinity, colors: true}));
    }


    //  NODE
    find({key}) {
        let emitter = new EventEmitter();

        //TODO  Check if the item is locally stored
        let contacts = this.router.get_contacts_near(key, this.router.peers, this.self.buffer);
        contacts.map((contact) => {
            //  Create the request message once per contact to avoid message ID collision when/if awaiting a response
            let request = new Message({method: "find", params: {key: key, limit: this.router.peers, sender: {id: this.self.id, time: this.self.clock.time}}});
            let handshake = this.rpc.send_message(request, {host: contact.host, port: contact.port});

            handshake.once("response", (message, {host, port}) => {
                emitter.emit("response", message, {host, port});
                handshake.removeAllListeners("timeout");
            });

            handshake.once("timeout", () => {
                emitter.emit("timeout");
            });
        });

        return emitter;
    }

    store({key, value}) {
        this.self.clock.update(this.self.id);
        
        let item = new Item({key: key, value: value, publisher: this.self.id, hash: this.self.hash});
        
        let contacts = this.router.get_contacts_near(item.key, this.router.peers, this.self.buffer);
        contacts.map((contact) => {
            //  Create the request message once per contact to avoid message ID collision when/if awaiting a response
            let request = new Message({method: "store", params: {item: item, sender: {id: this.self.id, time: this.self.clock.time}}});
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