const { EventEmitter } = require("events");
const dgram = require("dgram");
const crypto = require("crypto");

const Message = require("./message");

const PACKETS = {
    REQUEST: 0x9000,
    ACKNOWLEDGE: 0x9001,
};

const pending_calls = new Map();

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

        this.on("acknowledge", (id) => {
            if(pending_calls.has(id)) {
                let { emitter, interval } = pending_calls.get(id);

                clearInterval(interval);
                emitter.emit("connected");

                pending_calls.delete(id);
            }
        });
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
            let host = rinfo.address;
            let port = rinfo.port;
    
            const type = bytes.readUInt16BE(0);
            switch (type) {
                case PACKETS.REQUEST:
                    //  Request
                    this.on_request({host, port}, bytes.slice(2));
    
                    break;
                
                case PACKETS.ACKNOWLEDGE:
                    //  Acknowledge
                    this.on_acknowledge({host, port}, bytes.slice(2));
    
                    break;
            
                default:
                    //  Message
                    this.on_message({host, port}, bytes);
    
                    break;
            }
        };
    }

    send_request({host, port}, id) {
        //  Type
        const type_bytes = Buffer.allocUnsafe(2);
        type_bytes.writeUInt16BE(PACKETS.REQUEST);

        //  Value
        const value_bytes = Buffer.from(id);
        
        //  Combination
        const message = Buffer.concat([type_bytes, value_bytes]);
        this.socket.send(message, 0, message.length, port, host);

        console.log(`sent request packet ${id} to ${host}:${port}`);
    }
    
    send_acknowledge({host, port}, id) {
        //  Type
        const type_bytes = Buffer.allocUnsafe(2);
        type_bytes.writeUInt16BE(PACKETS.ACKNOWLEDGE);

        //  Value
        const value_bytes = Buffer.from(id);
        
        //  Combination
        const message = Buffer.concat([type_bytes, value_bytes]);
        this.socket.send(message, 0, message.length, port, host);

        console.log(`sent acknowledge packet ${id} to ${host}:${port}`);
    }

    on_request({host, port}, bytes) {
        const id = bytes.toString();
        console.log(`receiving request packet with token ${id} from ${host}:${port}`);

        this.emit("request", id);
        this.send_acknowledge({host, port}, id);
    }

    on_acknowledge({host, port}, bytes) {
        const id = bytes.toString();
        console.log(`receiving acknowledge packet with token ${id} from ${host}:${port}`);

        this.emit("acknowledge", id);
    }

    on_message({host, port}, bytes) {
        try {
            let spec = JSON.parse(bytes.toString());
            let message = new Message(spec);

            let is_request = !!(message.method && message.params);
            let is_response = !!((message.result != null) || message.error);

            this.emit("message", message, {host, port});
            if(is_request) {
                this.emit(message.method, message.params, {host, port});
            } else if(is_response) {

            } else {
                console.log("dropping irrelevant message");
            }
        } catch (error) {
            console.log(error);
        }
    }

    call({host, port}, attempts = 60, timeout = 1000) {
        let emitter = new EventEmitter();
        let id = this.create_id();

        let interval = setInterval(() => {
            if(attempts > 0) {
                attempts--;
                this.send_request({host, port}, id);
            } else {
                console.log(`connection to ${host}:${port} timed out`);
                
                clearInterval(interval);
                emitter.emit("timeout");

                pending_calls.delete(id);
            }
            
        }, timeout);

        pending_calls.set(id, {emitter, interval});
        return emitter;
    }

    send_message(message, {host, port}) {
        let caller = this.call({host, port});

        caller.on("connected", () => {
            this.socket.send(message, port, host);
        });
        return caller;
    }
}

module.exports = RPC;