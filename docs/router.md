# **Router**

The router is one of the most important parts of the network, its role is to structure the peer-to-peer network.

Structuring the network to make it more reliable by allowing nodes to stay interconnected directly or indirectly even in the event of one or more nodes going offline.

# **Contents**

* constructor
    * [new Router(options)](#new-routeroptions)
* getters
    * [router.size](#routersize)
    * [router.contacts](#routercontacts)
* methods
    * [router.distance(buffer0, buffer1)](#routerdistancebuffer0-buffer1)
    * [router.get_bucket_index(contact0, contact1)](#routerget_bucket_indexcontact0-contact1)
    * [router.update_contact(contact)](#routerupdate_contactcontact)
    * [router.to_head(contact, bucket)](#routerto_headcontact-bucket)
    * [router.to_tail(contact, bucket)](#routerto_tailcontact-bucket)
    * [router.ping_head(contact, bucket)](#routerping_headcontact-bucket)
    * [router.get_contacts_near(buffer, limit, sender)](#routerget_contacts_nearbuffer-limit-sender)
    * [router.has_contact_id(id)](#routerhas_contact_idid)
    * [router.get_contact(id)](#routerget_contactid)

# **Constructor**

#### new Router(options)

* `options`:
    * `contact`: [_Contact_](contact.md) The node's local contact informations.
    * `rpc`: [_RPC_](rpc.md) The remote procedure call class of the node.
    * `capacity`: _Integer_ The maximum amount of buckets to be stored in the router.
    * `peers`: _Integer_ The maximum amount of contacts to be stored per bucket.

\
**Creates a new Router instance.**
```js
const plexus = require("plexus");

let contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

let RPC = new RPC({
    port: 8080
});

//  Router creation
let router = new plexus.Router({
    contact: contact,
    rpc: RPC,
    capacity: 160,
    peers: 20
});
```

# **Getters**

#### router.size

\
**Returns the number of known contacts.**
```js
//  Get the number of contacts
let size = router.size;
```

#### router.contacts

\
**Returns the list of every known contacts.**
```js
//  Get the list of contacts
let contacts = router.contacts;
```

# **Methods**

#### router.distance(buffer0, buffer1)
* `buffer0`: _Buffer_ Buffer to calculate the XOR distance to.
* `buffer1`: _Buffer_ Buffer to calculate the XOR distance from.

\
**Returns the XOR Metric distance between two buffers (buffers dont need to be of same length).**
```js
let distance = router.distance(Buffer.from(contact0.id), Buffer.from(contact1.id));
```

#### router.get_bucket_index(contact0, contact1)
* `contact0`: [_Contact_](contact.md) Contact to calculate the XOR distance to.
* `contact1`: [_Contact_](contact.md) Contact to calculate the XOR distance from.

\
**Returns the bucket index of a contact based on its distance to another contact (generally the node's local contact).**
```js
let bucket_index = this.get_bucket_index(node.self, contact);
```

#### router.update_contact(contact)
* `contact`: [_Contact_](contact.md) Contact to add, remove or update with a newer verion.

\
**Updates the list of contacts (add new, update order, replace old).**
```js
let contact = new plexus.Contact({
    host: host,
    port: port,
    id: id,
    clock: new plexus.VectorClock()
});

//  Add the contact if new, update if already known or ignore if not valid
router.update_contact(contact);
```

#### router.to_head(contact, bucket)
* `contact`: [_Contact_](contact.md) Contact to move to the head of the bucket.
* `bucket`: [_Bucket_](bucket.md) Bucket in which to move the contact.

\
**Moves the contact to the head of the specified bucket.**
```js
let contact = new plexus.Contact({
    host: host,
    port: port,
    id: id,
    clock: new plexus.VectorClock()
});

let bucket = new plexus.Bucket();

//  Move to head
router.to_head(contact, bucket)
```

#### router.to_tail(contact, bucket)
* `contact`: [_Contact_](contact.md) Contact to move to the tail of the bucket.
* `bucket`: [_Bucket_](bucket.md) Bucket in which to move the contact.

\
**Moves the contact to the tail of the specified bucket.**
```js
let contact = new plexus.Contact({
    host: host,
    port: port,
    id: id,
    clock: new plexus.VectorClock()
});

let bucket = new plexus.Bucket();

//  Move to tail
router.to_tail(contact, bucket)
```

#### router.ping_head(contact, bucket)
* `contact`: [_Contact_](contact.md) Contact to replace the head of the bucket with if it is unreachable.
* `bucket`: [_Bucket_](bucket.md) Bucket in which to move the contact.

\
**Replaces the contact at head of the specified bucket with the new contact if it does not respond (no longer online or unreachable).**
```js
let contact = new plexus.Contact({
    host: host,
    port: port,
    id: id,
    clock: new plexus.VectorClock()
});

let bucket = new plexus.Bucket();

//  Replace if head is unreachable
router.ping_head(contact, bucket)
```

#### router.get_contacts_near(buffer, limit, sender)
* `buffer`: _Buffer_ Buffer to calculate the XOR distance from.
* `limit`: _Integer_ The maximum number of contacts to return.
* `sender`: _Buffer_ Buffer to calculate the XOR distance to.

\
**Returns a list of the nearest contacts from the specified buffer.**
```js
//  The local node is 0xa45681de963cbfb2e841d2c94d450312347x3b235fb70fb27f2f69285ce481ce
//  We want a list of the 20 closest known contacts to 0xa6564bce963cbfb2e841d2c94d450368c1463b235fb70fb27f2f69285cacf8ed
let contacts = router.get_contacts_near(Buffer.from("0xa6564bce963cbfb2e841d2c94d450368c1463b235fb70fb27f2f69285cacf8ed"), 20, Buffer.from("0xa45681de963cbfb2e841d2c94d450312347x3b235fb70fb27f2f69285ce481ce"));
```

#### router.has_contact_id(id)
* `id`: _String_ The ID of the contact to look for.

\
**Checks if the router already contains a contact with the specified ID.**
```js
//  Returns true if the router contain a contact with that ID
let exists = router.has_contact_id("0xa6564bce963cbfb2e841d2c94d450368c1463b235fb70fb27f2f69285cacf8ed");
```

#### router.get_contact(id)
* `id`: _String_ The ID of the contact to look for.

\
**Returns a contact with the specified ID if the router contains one.**
```js
//  If contact is null the router doesn't contain any contacts with that ID
let contact = router.get_contact("0xa6564bce963cbfb2e841d2c94d450368c1463b235fb70fb27f2f69285cacf8ed");
```