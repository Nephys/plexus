const { EventEmitter } = require("events");

const Contact = require("./contact");
const Message = require("./message");
const Router = require("./router");
const RPC = require("./rpc");
const VectorClock = require("./vector_clock");

class Node extends EventEmitter {
    constructor({
        host = "127.0.0.1",
        port = 8080,
        id,
        
        capacity = 160,
        peers = 20
    } = {}) {
        super();

        //TODO
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

        //  RPC Message handler
        this.bind_rpc_handlers();
    }

    bind_rpc_handlers() {
        let handlers = [
            {"PING": this.on_ping},
            {"FIND": this.on_find},
        ];

        for (let i = 0; i < handlers.length; i++) {
            this.rpc.on(Object.keys(handlers[i])[0], Object.values(handlers[i])[0].bind(this));
        }

        this.rpc.on("ready", () => {
            console.log(`node ${this.self.id} listening on ${this.self.name}`);
        });
    }

    on_ping(message, {host, port}) {
        let params = message.params;
        let contact = new Contact({
            host: host,
            port: port,
            id: params.id,
            clock: new VectorClock({start: params.time})
        });

        console.log(`received PING from ${contact.name} with id ${contact.id}`);
        
        this.router.update_contact(contact);
        this.self.clock.update(contact.id);
        this.rpc.send_message(new Message({result: {id: this.self.id, time: this.self.clock.time}, id: message.id}), {host, port});
    }

    on_find(message, {host, port}) {
        let params = message.params;
        let key = params.key;
        let limit = this.router.peers;
        let sender = new Contact({
            host: host,
            port: port,
            id: params.id
        });

        let near = this.router.get_contacts_near(key, limit, sender);
        return near;
    }

    connect({host, port}) {
        let handshake = this.rpc.send_message(new Message({method: "ping", params: {id: this.self.id, time: this.self.clock.time}}), {host, port});
        this.self.clock.update(this.self.id);
        // handshake.on("connected", () => {
        //     this.emit("connected", {host, port});
        // });

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