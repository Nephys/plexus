const items = new Map();
const republish_list = new Map();

class Storage {
    constructor() { }

    has(key) {
        return items.has(key);
    }

    get(key) {
        return items.get(key);
    }

    set(key, value, republish = false) {
        items.set(key, value);

        if(republish) {
            republish_list.set(key, value);
        }
    }

    delete(key) {
        items.delete(key);

        if(republish_list.has(key)) {
            republish_list.delete(key);
        }
    }

    get_republishable_items() {
        return Array.from(republish_list.values());
    }

    get_items() {
        return Array.from(items.values());
    }

}

module.exports = Storage;