const Bucket = require("./bucket");
const Message = require("./message");

class Router {
    constructor(options = {}) {
        this.self = options.contact;

        this.rpc = options.rpc;
        this.capacity = options.capacity;
        this.peers = options.peers;
        this.buckets = {};
    }

    distance(contact0, contact1) {
        let buffer0 = contact0.buffer;
        let buffer1 = contact1.buffer;

        let min = Math.min(buffer0.length, buffer1.length);
        let max = Math.max(buffer0.length, buffer1.length);

        let distance = Buffer.alloc(max);

        for(let i = 0; i < min; i++) {
            distance[i] = buffer0[i] ^ buffer1[i];
        }

        let buffer = buffer0.length == max ? buffer0 : buffer1;
        for(let i = min; i < max; i++) {
            distance[i] = buffer[i];
        }

        return distance;
    }

    get size() {
        return Object.keys(this.buckets).length;
    }

    get contacts() {
        let contacts = [];
        let indexes = Object.keys(this.buckets);

        for (let i = 0; i < indexes.length; i++) {
            let index = indexes[i];
            let bucket = this.buckets[index];

            contacts = contacts.concat(bucket.get_contacts());
        }

        return contacts;
    }

    get_bucket_index(contact0, contact1) {
        let distance = this.distance(contact0, contact1);
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

    update_contact(contact) {
        let bucket_index = this.get_bucket_index(this.self, contact);

        let bucket = this.buckets[bucket_index] = !this.buckets[bucket_index] ? new Bucket() : this.buckets[bucket_index];
        if(bucket.has_contact(contact)) {
            this.to_tail(contact, bucket);
        } else if(bucket.size < this.peers) {
            this.to_head(contact, bucket);
        } else {
            this.ping_head(contact, bucket);
        }
    }

    to_head(contact, bucket) {
        //  Move to the start of the contact list
        bucket.add_contact(contact);
    }

    to_tail(contact, bucket) {
        //  Move to the end of the contact list
        bucket.remove_contact(contact);
        bucket.add_contact(contact);
    }

    ping_head(contact, bucket) {
        //  Replace the contact at head with the new contact if it does not respond
        let head = bucket.get_contact(0);
        let ping = new Message({method: "ping", params: {id: this.self.id}});

        let handshake = this.rpc.send_message(ping.serialize(), {host: head.host, port: head.port});
        handshake.on("timeout", () => {
            this.remove_contact(head);
            this.add_contact(contact);
        });
    }

    get_contacts_near(buffer, limit, sender_contact) {
        let contacts = this.contacts.map((c) => {
            let key_contact = {
                buffer
            }
            let distance = this.distance(c, key_contact);

            return {
                contact: c,
                distance
            };
        }).sort((a, b) => {
            let min = Math.min(a.distance.length, b.distance.length);
            let max = Math.max(a.distance.length, b.distance.length);

            for (let i = 0; i < min; i++) {
                if (a.distance[i] !== b.distance[i]) {
                    if (a.distance[i] < b.distance[i]) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            }

            let c = a.distance.length == max ? a : b;
            for(let i = min; i < max; i++) {
                if (c.distance[i] !== 0) {
                    return 1;
                }
            }

            return 0;
        }).filter((c) => {
            return c.contact.id !== sender_contact.id;
        }).splice(0, limit).map((c) => {
            return c.contact;
        });

        return contacts;
    }
}

module.exports = Router;