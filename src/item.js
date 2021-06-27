const crypto = require("crypto");

class Item {
    constructor({
        key,
        value,

        publisher,
        timestamp,

        hash = { algorithm: "sha256", encoding: "hex" }
    } = {}) {
        if(!value || !publisher || !timestamp) {
            throw new Error("Invalid item specification");
        }

        this.value = value;
        this.key = key || this.create_hash(this.value, hash);

        this.publisher = publisher;

        this.timestamp = timestamp;
    }

    create_hash(data, hash = { algorithm: "sha256", encoding: "hex" }) {
        return crypto.createHash(hash.algorithm).update(data).digest(hash.encoding);
    }
}

module.exports = Item;