const crypto = require("crypto");

class Item {
    constructor({
        key,
        value,

        publisher,
        timestamp
    } = {}) {
        if(value == undefined || publisher == undefined || timestamp == undefined) {
            throw new Error("Invalid item specification");
        }

        this.value = value;
        this.key = key || this.create_hash(this.value);

        this.publisher = publisher;

        this.timestamp = timestamp;
    }

    create_hash(data) {
        return crypto.createHash("sha256").update(data).digest("hex");
    }
}

module.exports = Item;