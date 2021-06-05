const crypto = require("crypto");

const VectorClock = require("./vector_clock");

class Contact {
    constructor(options = {}) {
        this.host = options.host || "127.0.0.1";
        this.port = options.port || 8080

        this.hash = options.hash || {algorithm: "sha256", encoding: "hex"};
        this.hash.algorithm = this.hash.algorithm ? this.hash.algorithm : "sha256";
        this.hash.encoding = this.hash.encoding ? this.hash.encoding : "hex";

        this.id = options.id || this.generate_id();

        this.clock = new VectorClock({
            id: this.id
        });
    }

    generate_id() {
        // return Buffer.from(crypto.createHash("sha256").update(this.name).digest("hex"));
        // return crypto.createHash("sha256").update(this.name).digest("hex");
        // return crypto.createHash(Hash.ALGORITHM).update(this.name).digest(Hash.ENCODING);
        // let hash = crypto.createHash(this.hash.algorithm).update(this.name).digest(this.hash.encoding);
        
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