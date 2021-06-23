const crypto = require("crypto");

class Item {
    constructor({
        key,
        value,
        publisher,
        
        hash = { algorithm: "sha256", encoding: "hex" }
    } = {}) {
        this.value = value;
        this.key = key || this.create_hash(this.value, hash);

        this.publisher = publisher;
    }

    create_hash(data, hash = { algorithm: "sha256", encoding: "hex" }) {
        return crypto.createHash(hash.algorithm).update(data).digest(hash.encoding);
    }
}

module.exports = Item;