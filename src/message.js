const VERSION = "2.0";

class Message {
    constructor(spec = {}) {
        this.jsonrpc = VERSION;

        if(this.is_request(spec)) {

            this.method = spec.method.toUpperCase();
            this.params = spec.params;

        }else if(this.is_response(spec)) {

            // this.result = Object.assign({}, spec.result);
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

    serialize() {
        return Buffer.from(JSON.stringify(this), "utf-8");
    }

    is_request(parsed) {
        return !!(parsed.method && parsed.params);
    }

    is_response(parsed) {
        return !!((parsed.result != null) || parsed.error);
        // return !!(parsed.id && (parsed.result || parsed.error));
    }
}

module.exports = Message;