const crypto = require("crypto");

const VERSION = "2.0";

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

        let spec = {id, method, params, result, error};
        if(this.is_request(spec)) {
            this.method = spec.method.toUpperCase();
            this.params = spec.params;
        }else if(this.is_response(spec)) {
            this.result = spec.result;

            if(spec.error) {
                this.error = {
                    code: -32603,
                    message: spec.error.message
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

    is_request(parsed) {
        return !!(parsed.method && parsed.params);
    }

    is_response(parsed) {
        return !!(parsed.id && ((parsed.result != null) || parsed.error));
    }
}

module.exports = Message;