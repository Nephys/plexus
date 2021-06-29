const crypto = require("crypto");

const VERSION = "2.0";

const MESSAGE_TYPES = {
    REQUEST: 0,
    RESPONSE: 1,
    UNKNOWN: -1
}

class Message {
    constructor({
        id,

        method,
        params,

        result,
        error
    } = {}) {
        this.jsonrpc = VERSION;
        this.id = id || this.create_id();

        let specs = {id, method, params, result, error};
        let type = this.message_type(specs);
        
        if(type == MESSAGE_TYPES.REQUEST) {
            this.method = specs.method.toUpperCase();
            this.params = specs.params;
        }else if(type == MESSAGE_TYPES.RESPONSE) {
            this.result = specs.result;

            if(specs.error) {
                this.error = {
                    code: -32603,
                    message: specs.error.message
                }
            }
        }else {
            throw new Error("Invalid message specification");
        }
    }

    create_id() {
        return Buffer.from(crypto.randomBytes(16)).toString("hex");
    }

    serialize() {
        return Buffer.from(JSON.stringify(this), "utf-8");
    }

    //  Returns the type of the message (REQUEST, RESPONSE or UNKNOWN)
    message_type(specs) {
        let is_request = !!(specs.method !== undefined && specs.params !== undefined);
        let is_response = !!(specs.id && ((specs.result !== undefined) || specs.error));

        let type = is_request ? MESSAGE_TYPES.REQUEST : is_response ? MESSAGE_TYPES.RESPONSE : MESSAGE_TYPES.UNKNOWN;
        return type;
    }
}

module.exports = Message;