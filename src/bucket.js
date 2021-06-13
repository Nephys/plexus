class Bucket {
    constructor() {
        this.contacts = [];
    }

    get size() {
        return this.contacts.length;
    }

    get_contacts() {
        return [].concat(this.contacts);
    }

    get_contact(index) {
        return this.contacts[index] || null;
    }

    get_index(contact) {
        return this.contacts.map((c) => {
            return c.id;
        }).indexOf(contact.id);
    }

    add_contact(contact) {
        if(!this.has_contact(contact)) {
            let index = this.contacts.concat(contact).sort((a, b) => {
                return a.clock - b.clock;
            }).indexOf(contact);

            this.contacts.splice(index, 0, contact);
        }
    }

    remove_contact(contact) {
        let index = this.get_index(contact);

        if(index >= 0) {
            this.contacts.splice(index, 1);
        }
    }

    has_contact(contact) {
        return this.contacts.map((c) => {
            return c.id;
        }).includes(contact.id);
    }

    to_head(contact) {
        //  Move to the start of the contact list
        this.add_contact(contact);
    }

    to_tail(contact) {
        //  Move to the end of the contact list
        this.remove_contact(contact);
        this.add_contact(contact);
    }

    ping_head(contact) {
        // let head = this.get_contact(0);
        // let ping = new Message({method: "PING", params: {}});
    }
}

module.exports = Bucket;