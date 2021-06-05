const { EventEmitter } = require("events");
const dgram = require("dgram");
const crypto = require("crypto");

const Contact = require("./contact");
const Message = require("./message");

const PACKET = {
    REQUEST: 0x9000,
    ACKNOWLEDGE: 0x9001,
};

class RPC extends EventEmitter {
    constructor(options = {}) {
        super();

        this.port = options.port || 8080
        
        this.socket = dgram.createSocket("udp4");
        
        //  Socket Error
        this.socket.on("error", this.error_handler());

        //  Socket Message
        this.socket.on("message", this.message_handler());

        this.socket.on("listening", () => {
            // this.socket.addMembership("239.255.255.250");
            this.emit("ready");
        });
        
        this.socket.bind(this.port);
    }

    create_id() {
        return Buffer.from(crypto.randomBytes(16)).toString("hex");
    }

    error_handler() {
        return (error) => {
            console.log(error.message);
        };
    }

    message_handler() {
        return (bytes, rinfo) => {
            const contact = new Contact({
                host: rinfo.address,
                port: rinfo.port
            });
    
            const type = bytes.readUInt16BE(0);
            switch (type) {
                case PACKET.REQUEST:
                    //  Request
                    this.on_request(contact, bytes.slice(2));
    
                    break;
                
                case PACKET.ACKNOWLEDGE:
                    //  Acknowledge
                    this.on_acknowledge(contact, bytes.slice(2));
    
                    break;
            
                default:
                    //  Message
                    this.on_message(contact, bytes);
    
                    break;
            }
        };
    }

    send_request(contact, id) {
        //  Type
        const type_bytes = Buffer.allocUnsafe(2);
        type_bytes.writeUInt16BE(PACKET.REQUEST);

        //  Value
        const value_bytes = Buffer.from(id);
        
        //  Combination
        const message = Buffer.concat([type_bytes, value_bytes]);
        this.socket.send(message, 0, message.length, contact.port, contact.host);

        console.log(`sent request packet ${id} to ${contact.host}:${contact.port}`);
    }
    
    send_acknowledge(contact, id) {
        //  Type
        const type_bytes = Buffer.allocUnsafe(2);
        type_bytes.writeUInt16BE(PACKET.ACKNOWLEDGE);

        //  Value
        const value_bytes = Buffer.from(id);
        
        //  Combination
        const message = Buffer.concat([type_bytes, value_bytes]);
        this.socket.send(message, 0, message.length, contact.port, contact.host);

        console.log(`sent acknowledge packet ${id} to ${contact.host}:${contact.port}`);
    }

    on_request(contact, bytes) {
        const id = bytes.toString();
        console.log(`receiving request packet with token ${id} from ${contact.host}:${contact.port}`);

        this.emit("request", id);
        this.send_acknowledge(contact, id);
    }

    on_acknowledge(contact, bytes) {
        const id = bytes.toString();
        console.log(`receiving acknowledge packet with token ${id} from ${contact.host}:${contact.port}`);

        this.emit("acknowledge", id);
    }

    on_message(contact, bytes) {
        try {
            let spec = JSON.parse(bytes.toString());
            let message = new Message(spec);

            let is_request = !!(message.method && message.params);
            let is_response = !!((message.result != null) || message.error);

            this.emit("message", message, contact);
            if(is_request) {
                this.emit(message.method, message.params, contact);
            } else if(is_response) {

            } else {
                console.log("dropping irrelevant message");
            }
        } catch (error) {
            console.log(error);
        }
    }

    call(contact, attempts = 60, timeout = 1000) {
        let emitter = new EventEmitter();
        let id = this.create_id();

        let verify = (remote_id) => {
            if (remote_id == id) {
                clearInterval(interval);
                
                console.log(`connection to ${contact.host}:${contact.port} established`);

                this.removeListener("acknowledge", verify);
                emitter.emit("connected");
            }
        }
        this.on("acknowledge", verify);

        let interval = setInterval(() => {
            if(attempts > 0) {
                attempts--;
                this.send_request(contact, id);
            } else {
                clearInterval(interval);

                console.log(`connection to ${contact.host}:${contact.port} timed out`);

                this.removeListener("acknowledge", verify);
                emitter.emit("timeout");
            }
            
        }, timeout);

        return emitter;
    }

    send_message(message, contact) {
        let caller = this.call(contact);

        caller.on("connected", () => {
            this.socket.send(message, contact.port, contact.host);
        });
        return caller;
    }
}

module.exports = RPC;