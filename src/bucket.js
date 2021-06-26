class Bucket {
    constructor() {
        this.contacts = [];
    }

    //  Returns the amount of known contacts
    get size() {
        return this.contacts.length;
    }

    //  Returns the list of known contacts
    get_contacts() {
        return [].concat(this.contacts);
    }

    //  Returns the contact stored at the specified index
    get_contact(index) {
        return this.contacts[index] || null;
    }

    //  Get the index of a contact
    get_index(contact) {
        return this.contacts.map((c) => {
            return c.id;
        }).indexOf(contact.id);
    }

    //  Add a contact to the bucket
    add_contact(contact) {
        if(!this.has_contact(contact)) {
            let index = this.contacts.concat(contact).sort((a, b) => {
                return a.clock.time - b.clock.time;
            }).indexOf(contact);

            this.contacts.splice(index, 0, contact);
        }
    }

    //  Remove a contact from the bucket
    remove_contact(contact) {
        let index = this.get_index(contact);

        if(index >= 0) {
            this.contacts.splice(index, 1);
        }
    }

    //  Check if the contact is stored in the bucket
    has_contact(contact) {
        return this.contacts.map((c) => {
            return c.id;
        }).includes(contact.id);
    }
}

module.exports = Bucket;