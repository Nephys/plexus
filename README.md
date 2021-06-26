# Plexus
Decentralized peer-to-peer network for storage and realtime communication based on the [Kademlia](http://www.scs.stanford.edu/~dm/home/papers/kpos.pdf) distributed hash table

# Quick Start
Creating a Plexus Node and joining the Mesh Network.
```js
const Plexus = require("Plexus");

//  Node creation
let node = new Plexus.Node({host: "127.0.0.1", port: 8080});    //  By default the host and port are 127.0.0.1:8080

//  Join the network
node.connect({host: "remote_ip", port: remote_port});
```

# Storage
Storing and retrieving data on the Network.
```js
//  Storing data
node.store({key: key, value: value});   //  If no key is provided it will default to the hash of the value stored

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

# Communication
Broadcasting to the whole Network.
```js
//  Sendind to the Network
node.broadcast({data: data});

//  Handling incoming Broadcasts
node.on("broadcast", (message) => {
    let data = message.params.data;
    console.log(data);
});
```