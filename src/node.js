const { EventEmitter } = require("events");

const Contact = require("./contact");
const Message = require("./message");
const Router = require("./router");
const RPC = require("./rpc");

class Node extends EventEmitter {
    constructor(options = {}) {
        super();

        //TODO
        //  Node's own contact information
        this.self = options.contact || new Contact();
        
        //  Remote Procedure Calls
        this.rpc = new RPC({
            port: this.self.port
        });

        //  Network router keeping the network structured
        this.router = new Router({
            contact: this.self,
            rpc: this.rpc,
            capacity: options.capacity || 160,
            peers: options.peers || 20
        });

        //  RPC Message handler
        this.bind_rpc_handlers();
    }

    bind_rpc_handlers() {
        let handlers = [
            {"PING": this.on_ping},
            {"PONG": this.on_pong}
        ];

        for (let i = 0; i < handlers.length; i++) {
            this.rpc.on(Object.keys(handlers[i])[0], Object.values(handlers[i])[0].bind(this));
        }

        this.rpc.on("ready", () => {
            console.log(`node listening on ${this.self.name}`);
        });
    }

    on_ping(params, {host, port}) {
        let contact = new Contact({
            host: host,
            port: port,
            id: params.id
        });

        console.log(`received PING from ${contact.name} with id ${contact.id}`);
        
        this.self.clock.update(contact.id);
        this.rpc.send_message(new Message({method: "pong", params: {id: this.self.id}}).serialize(), {host, port});
        
        console.log(`sent PONG to ${contact.name} with id ${this.self.id}`);
    }

    on_pong(params, {host, port}) {
        let contact = new Contact({
            host: host,
            port: port,
            id: params.id
        });

        console.log(`received PONG from ${contact.name} with id ${contact.id}`);

        contact.id = params.id;
        this.self.clock.update(contact.id);
    }

    async connect({host, port}) {
        // this.rpc.send_message(JSON.stringify({type:"connect"}), contact);

        this.rpc.send_message(new Message({method: "ping", params: {id: this.self.id}}).serialize(), {host, port});
        // this.router.update_contact(contact);
        
        // this.self.clock.update();
        // this.emit("connect", contact);
    }
}

module.exports = Node;