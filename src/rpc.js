const { EventEmitter } = require("events");
const dgram = require("dgram");
const crypto = require("crypto");

const Message = require("./message");

const PACKETS = {
    REQUEST: 0x9000,
    ACKNOWLEDGE: 0x9001,
};

const MESSAGE_TYPES = {
    REQUEST: 0,
    RESPONSE: 1,
    UNKNOWN: -1
}

const pending_handshakes = new Map();
const pending_requests = new Map();

class RPC extends EventEmitter {
    constructor({
        port = 8080
    } = {}) {
        super();

        this.port = port;
        
        this.socket = dgram.createSocket("udp4");
        
        //  Socket Error
        this.socket.on("error", this.error_handler.bind(this));

        //  Socket Message
        this.socket.on("message", this.message_handler.bind(this));

        this.socket.on("listening", () => {
            this.emit("ready");
        });
        
        //  Start listening on the socket
        this.socket.bind(this.port);
    }

    create_id() {
        return Buffer.from(crypto.randomBytes(16)).toString("hex");
    }

    error_handler(error) {
        console.log(error.message);
    }

    message_handler(bytes, rinfo) {
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

        this.send_acknowledge({host, port}, id);
    }

    on_acknowledge({host, port}, bytes) {
        const id = bytes.toString();
        console.log(`receiving acknowledge packet with token ${id} from ${host}:${port}`);

        // Handle pending handshakes if any
        if(pending_handshakes.has(id)) {
            let { emitter, negotiator } = pending_handshakes.get(id);

            clearInterval(negotiator);
            emitter.emit("connected");

            pending_handshakes.delete(id);
        }
    }

    //  Message parsing
    on_message({host, port}, bytes) {
        try {
            let spec = JSON.parse(bytes.toString());
            let message = new Message(spec);

            this.emit("message", message, {host, port});
            if(this.message_type(message) == MESSAGE_TYPES.REQUEST) {
                this.emit(message.method, message, {host, port});
            } else if(this.message_type(message) == MESSAGE_TYPES.RESPONSE && message.id) {
                if(pending_requests.has(message.id)) {
                    let emitter = pending_requests.get(message.id);
                    emitter.emit("response", message, {host, port});
                    pending_requests.delete(message.id);
                }
            } else {
                console.log("dropping irrelevant message");
            }
        } catch (error) {
            console.log(error);
        }
    }

    message_type(message) {
        let is_request = !!(message.method && message.params);
        let is_response = !!((message.result != null) || message.error);

        let type = is_request ? MESSAGE_TYPES.REQUEST : is_response ? MESSAGE_TYPES.RESPONSE : MESSAGE_TYPES.UNKNOWN;
        return type;
    }

    //  Handshake negotiation
    handshake({host, port}, attempts = 60, timeout = 1000) {
        let emitter = new EventEmitter();
        let id = this.create_id();

        //  Ping the remote until it responds or the handshake times out
        console.log(`negotiating handshake with ${host}:${port}`);
        let negotiator = setInterval(() => {
            if(attempts > 0) {
                attempts--;
                this.send_request({host, port}, id);
            } else {
                console.log(`connection to ${host}:${port} timed out`);
                
                clearInterval(negotiator);
                emitter.emit("timeout");

                pending_handshakes.delete(id);
            }
            
        }, timeout);

        pending_handshakes.set(id, {emitter, negotiator});
        return emitter;
    }

    send_message(message, {host, port}) {
        //  Initiate a handshake with the remote
        let handshake = this.handshake({host, port});

        //  Only send the message if the remote is responding
        handshake.on("connected", () => {
            if(this.message_type(message) == MESSAGE_TYPES.REQUEST) {
                pending_requests.set(message.id, handshake);
            }

            this.socket.send(message.serialize(), port, host);
        });
        return handshake;
    }
}

module.exports = RPC;