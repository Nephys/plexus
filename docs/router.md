# **Router**

The router is one of the most important parts of the network, its role is to structure the peer-to-peer network.

Structuring the network to make it more reliable by allowing nodes to stay interconnected directly or indirectly even in the event of one or more nodes going offline.

# **Contents**

* constructor
    * [new Router(options)](#new-routeroptions)
* getters
    * [router.size](#routersize)
* methods
    * [router.distance(buffer0, buffer1)](#routerdistancebuffer0buffer1)

# **Constructor**

#### new Router(options)

* `options`:
    * `contact`: _Contact_ The node's local contact informations.
    * `rpc`: _RPC_ The remote procedure call class of the node.
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
let router = new Router({
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

# **Methods**

#### router.distance(buffer0, buffer1)
* `buffer0`: _Buffer_ Buffer to calculate the XOR distance from.
* `buffer1`: _Buffer_ Buffer to calculate the XOR distance to.

\
**Returns the XOR Metric distance between two buffers (buffers dont need to be of same length).**
```js
let distance = router.distance(Buffer.from(contact0.id), Buffer.from(contact1.id));
```