# **Node**

# **Contents**

* public methods
    * [new Node(options)](#new-nodeoptions)
    * [node.connect({ host, port })](#nodeconnect-host-port-)
    * [node.broadcast({ data })](#nodebroadcast-data-)
    * [node.store({ key, value })](#nodestore-key-value-)
    * [node.find({ key })](#nodefind-key-)

* private methods

* events

#### new Node(options)

* `options`:
    * `host`: _String_ _(Default: "127.0.0.1")_ Local IP of the node.
    * `port`: _Integer_ _(Default: 8080)_ UDP port of the node.
    * `capacity`: _Integer_ _(Default: 160)_ The maximum amount of buckets to be stored in the router.
    * `peers`: _Integer_ _(Default: 20)_ The maximum amount of contacts to be stored per bucket.
    * `refresh`: _Integer_ _(Default: 3600000)_ Bucket refresh interval.
    * `expire`: _Integer_ _(Default: 86400000)_ Item expiration time.
    * `republish`: _Integer_ _(Default: 86400000)_ Item republishing interval (only for the item publisher).
    * `replicate`: _Integer_ _(Default: 3600000)_ Data replication interval.

\
**Creates a new Node instance.**
```js
const Plexus = require("Plexus");

//  Node creation
let node = new Plexus.Node({host: "127.0.0.1", port: 8080});
```

#### node.connect({ host, port })
* `host`: _String_ Remote IP of the node to connect to.
* `port`: _Integer_ Remote UDP port of the node to connect to.

\
**Connects the node to the network.**
```js
//  Join the network
node.connect({host: "remote_ip", port: remote_port});
```

#### node.broadcast({ data })
* `data`: _Object_ The data to broadcast through the network.

\
**Broadcasts to the whole Network.**
```js
//  Sendind to the Network
node.broadcast({data: data});

//  Handling incoming Broadcasts
node.on("broadcast", (data) => {
    console.log(data);
});
```

#### node.store({ key, value })
* `key`: _String_ _(Optional, Default: hash-of-value)_ The key used to find and store the value.
* `value`: _Object_ The value to store on the network.

\
**Stores data on the Network.**
```js
//  Storing data
let item = node.store({key: key, value: value});
```

#### node.find({ key })
* `key`: _String_ The key used to find and store the value.

\
**Retrieving data on the Network.**
```js
//  Retrieving data
let lookup = node.find({key: key});

//  The item exists on the Network
lookup.on("found", (result) => {
    console.log(result);
});

//  The item doesn't exist anywhere on the Network
lookup.on("timeout", () => {
    console.log("FIND request timed out");
});
```