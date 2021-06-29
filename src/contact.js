const crypto = require("crypto");

const VectorClock = require("./vector_clock");

class Contact {
    constructor({
        host,
        port,
    
        id,
        clock = new VectorClock()
    } = {}) {
        if(host == undefined || port == undefined) {
            throw new Error("Invalid contact specification");
        }

        this.host = host;
        this.port = port;

        this.id = id || this.generate_id();

        this.clock = clock;
    }

    generate_id() {
        let seed = crypto.randomUUID({disableEntropyCache: true});
        let hash = crypto.createHash("sha256").update(seed).digest("hex");
        return `0x${hash}`
    }

    get name() {
        return `${this.host}:${this.port}`;
    }
}

module.exports = Contact;