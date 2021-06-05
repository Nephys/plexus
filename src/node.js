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
        // this.self.clock.update(this.self.id);
    }

    bind_rpc_handlers() {
        this.rpc.on("PING", this.on_ping.bind(this));
        this.rpc.on("PONG", this.on_pong.bind(this));

        this.rpc.on("ready", () => {
            console.log(`node listening on ${this.self.name}`);
        });
    }

    on_ping(params, contact) {
        console.log(`received PING from ${contact.name} with id ${params.id}`);
        
        contact.id = params.id;
        this.self.clock.update(contact.id);
        this.rpc.send_message(new Message({method: "pong", params: {id: this.self.id}}).serialize(), contact);
        
        console.log(`sent PONG to ${contact.name} with id ${this.self.id}`);
    }

    on_pong(params, contact) {
        console.log(`received PONG from ${contact.name} with id ${params.id}`);

        contact.id = params.id;
        this.self.clock.update(contact.id);
    }

    async connect(contact) {
        // this.rpc.send_message(JSON.stringify({type:"connect"}), contact);

        this.rpc.send_message(new Message({method: "ping", params: {id: this.self.id}}).serialize(), contact);
        this.router.update_contact(contact);
        
        // this.self.clock.update();
        this.emit("connect", contact);
    }
}

module.exports = Node;