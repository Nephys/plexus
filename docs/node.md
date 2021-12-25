# **Node**

Nodes are the heart of the Plexus Network, they allow your application to connect and interact with the network.

# **Contents**

* constructor
    * [new Node(options)](#new-nodeoptions)
* methods
    * [node.connect({ host, port })](#nodeconnect-host-port-)
    * [node.broadcast({ data })](#nodebroadcast-data-)
    * [node.message({ message, id })](#nodemessage-message-id-)
    * [node.store({ key, value, republish })](#nodestore-key-value-republish-)
    * [node.find({ key })](#nodefind-key-)
* events
    * [Event 'ready'](#event-ready)
    * [Event 'broadcast'](#event-broadcast)
    * [Event 'connected'](#event-connected)

# **Constructor**

#### new Node(options)

* `options`:
    * `host`: _String_ _(Default: "127.0.0.1")_ Local IP address of the node.
    * `port`: _Integer_ _(Default: 8080)_ UDP port of the node.
    * `id`: _String_ The local node ID.
    * `capacity`: _Integer_ _(Default: 160)_ The maximum amount of buckets to be stored in the router.
    * `peers`: _Integer_ _(Default: 20)_ The maximum amount of contacts to be stored per bucket.
    * `refresh`: _Integer_ _(Default: 3600000)_ Buckets refresh interval.
    * `expire`: _Integer_ _(Default: 86400000)_ Item expiration time.
    * `republish`: _Integer_ _(Default: 86400000)_ Item republishing interval (only for the item publisher).
    * `replicate`: _Integer_ _(Default: 3600000)_ Data replication interval.

\
**Creates a new Node instance.**
```js
const plexus = require("plexus");

//  Node creation
const node = new plexus.Node({host: "127.0.0.1", port: 8080});
```

# **Methods**

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

#### node.message({ message, id })
* `message`: _Any_ The data to send to the remote node.
* `id`: _String_ The ID of the remote node.

\
**Sends a message to a remote node.**
```js
//  Sendind to the remote node
node.message({message: "message", id: "id"});

//  Handling incoming Messages
node.on("message", (message, sender) => {
    console.log(message, sender);
});
```

#### node.store({ key, value, republish })
* `key`: _String_ _(Optional, Default: hash-of-value)_ The key used to find and store the value on the network.
* `value`: _Object_ The value to store on the network.
* `republish`: _Boolean_ _(Optional, Default: false)_ Whether or not to republish previously published items after they expire.

\
**Stores data on the Network.**
```js
//  Storing data
const item = node.store({key: key, value: value, republish: true});
```

#### node.find({ key })
* `key`: _String_ The key used to find and store the value.

\
**Retrieving data on the Network.**
```js
//  Retrieving data
const lookup = node.find({key: key});

//  The item exists on the Network
lookup.on("found", (result) => {
    console.log(result);
});

//  The item doesn't exist anywhere on the Network
lookup.on("timeout", () => {
    console.log("FIND request timed out");
});
```

# **Events**

#### Event 'ready'
Emitted when the local node is ready.

#### Event 'broadcast'
* `data`: _Object_ The data broadcasted through the network.

Emitted when another node issues a broadcast request to this node.

#### Event 'message'
* `message`: _Any_ The data received from a remote node.
* `sender`: _Object_ The remote node's informations.

Emitted when another node sends a message to this node.

#### Event 'connected'
* `contact`: [_Contact_](contact.md) The key used to find and store the value.

Emitted when the local node successfully connects to another one.