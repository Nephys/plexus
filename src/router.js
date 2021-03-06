const Bucket = require("./bucket");
const Message = require("./message");

class Router {
    constructor({
        contact,
        
        rpc,
        capacity,
        peers
    } = {}) {
        this.self = contact;

        this.rpc = rpc;
        this.capacity = capacity;
        this.peers = peers;
        this.buckets = {};
    }

    //  Returns the XOR Metric distance between two buffers (buffers dont need to be of same length)
    distance(buffer0, buffer1) {
        const min = Math.min(buffer0.length, buffer1.length);
        const max = Math.max(buffer0.length, buffer1.length);

        const distance = Buffer.alloc(max);

        for(let i = 0; i < min; i++) {
            distance[i] = buffer0[i] ^ buffer1[i];
        }

        const buffer = buffer0.length == max ? buffer0 : buffer1;
        for(let i = min; i < max; i++) {
            distance[i] = buffer[i];
        }

        return distance;
    }

    //  Returns the number of known contacts
    get size() {
        return Object.keys(this.buckets).length;
    }

    //  Returns a list of every known contacts
    get contacts() {
        let contacts = [];
        const indexes = Object.keys(this.buckets);

        for (let i = 0; i < indexes.length; i++) {
            const index = indexes[i];
            const bucket = this.buckets[index];

            contacts = contacts.concat(bucket.get_contacts());
        }

        return contacts;
    }

    //  Returns the bucket index of a contact based on its distance to another contact
    get_bucket_index(contact0, contact1) {
        const distance = this.distance(Buffer.from(contact0.id), Buffer.from(contact1.id));
        let index = distance.length;

        for (var i = 0; i < distance.length; i++) {
            if (distance[i] === 0) {
                index -= 8;
                continue;
            }
        
            for (var j = 0; j < 8; j++) {
                if (distance[i] & (0x80 >> j)) {
                    return --index;
                } else {
                    index--;
                }
            }
        }
        
        return index;
    }

    //  Remove a contact from the router
    remove_contact(contact) {
        const bucket_index = this.get_bucket_index(this.self, contact);
        if(bucket_index >= this.capacity) {
            return;
        }

        const bucket = this.buckets[bucket_index] = !this.buckets[bucket_index] ? new Bucket() : this.buckets[bucket_index];
        if(bucket.has_contact(contact)) {
            bucket.remove_contact(contact);
        }
    }

    //  Update the list of contacts (add new, update order, replace old)
    update_contact(contact) {
        const bucket_index = this.get_bucket_index(this.self, contact);
        if(bucket_index >= this.capacity) {
            return;
        }

        const bucket = this.buckets[bucket_index] = !this.buckets[bucket_index] ? new Bucket() : this.buckets[bucket_index];
        if(bucket.has_contact(contact)) {
            this.to_tail(contact, bucket);
        } else if(bucket.size < this.peers) {
            this.to_head(contact, bucket);
        } else {
            this.ping_head(contact, bucket);
        }
    }

    //  Move to the start of the contact list
    to_head(contact, bucket) {
        bucket.add_contact(contact);
    }

    //  Move to the end of the contact list
    to_tail(contact, bucket) {
        bucket.remove_contact(contact);
        bucket.add_contact(contact);
    }

    //  Replace the contact at head with the new contact if it does not respond
    ping_head(contact, bucket) {
        const head = bucket.get_contact(0);
        const ping = new Message({method: "ping", params: {id: this.self.id}});

        const handshake = this.rpc.send_message(ping, {host: head.host, port: head.port});
        handshake.on("timeout", () => {
            this.remove_contact(head);
            this.add_contact(contact);
        });
    }

    //  Returns a list of the nearest contacts from the specified buffer
    get_contacts_near(buffer, limit, sender) {
        const contacts = this.contacts.map((c) => {
            const distance = this.distance(Buffer.from(c.id), buffer);

            return {
                contact: c,
                distance
            };
        }).sort((a, b) => {
            const min = Math.min(a.distance.length, b.distance.length);
            const max = Math.max(a.distance.length, b.distance.length);

            for (let i = 0; i < min; i++) {
                if (a.distance[i] !== b.distance[i]) {
                    if (a.distance[i] < b.distance[i]) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            }

            const c = a.distance.length == max ? a : b;
            for(let i = min; i < max; i++) {
                if (c.distance[i] !== 0) {
                    return 1;
                }
            }

            return 0;
        }).filter((c) => {
            return Buffer.from(c.contact.id) !== sender;
        }).splice(0, limit).map((c) => {
            return c.contact;
        });

        return contacts;
    }

    has_contact_id(id) {
        return this.contacts.map((c) => {return c.id}).includes(id);
    }

    get_contact(id) {
        if(this.has_contact_id(id)) {
            const index = this.contacts.map((c) => {return c.id}).indexOf(id);
            return this.contacts[index];
        } else {
            return null;
        }
    }
}

module.exports = Router;