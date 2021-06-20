const crypto = require("crypto");

const VectorClock = require("./vector_clock");

class Contact {
    constructor({
        host = "127.0.0.1",
        port = 8080,
    
        hash = { algorithm: "sha256", encoding: "hex" },
        id,
        clock = new VectorClock()
    } = {}) {
        this.host = host;
        this.port = port;

        this.hash = hash

        this.id = id || this.generate_id();

        this.clock = clock;
    }

    generate_id() {
        let seed = crypto.randomUUID({disableEntropyCache: true});
        let hash = crypto.createHash(this.hash.algorithm).update(seed).digest(this.hash.encoding);
        return `0x${hash}`
    }

    get name() {
        return `${this.host}:${this.port}`;
    }

    get buffer() {
        let buffer = Buffer.from(this.id, 0, this.hash.encoding);
        return buffer;
    }
}

module.exports = Contact;