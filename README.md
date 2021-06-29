# **Plexus**
[![License](https://img.shields.io/github/license/Nephys/plexus)](https://github.com/Nephys/plexus/blob/main/LICENSE)

>Dependency-free decentralized peer-to-peer network for storage and realtime communication based on the [Kademlia](http://www.scs.stanford.edu/~dm/home/papers/kpos.pdf) distributed hash table.

# **Contents**
* [Testing](#testing)
* [Quick Start](#quick-start)
* [Storage](#storage)
* [Communication](#communication)
* [Documentation](#documentation)
* [TODO](#todo)
* [Support](#support-me-)

# **Testing**
```
npm run test
```
**This test will create a 50-Node Local Mesh Network and then go through the 4 following steps**

Step | Description
------------ | -------------
Item lookup | Testing if nodes can find an item on the network
Node lookup | Testing if nodes can find another node on the network
Broadcasting test | Testing if a node can broadcast to the rest of the network
Non existent item lookup | Testing if nodes dont find non existent data on the network*
###### * (The lookup should timemout and fail)

# **Quick Start**
Creating a Plexus Node and joining the Mesh Network.
```js
const plexus = require("plexus");

//  Node creation
let node = new plexus.Node({host: "127.0.0.1", port: 8080});    //  By default the host and port are 127.0.0.1:8080

//  Join the network
node.connect({host: "remote_ip", port: remote_port});
```

# **Storage**
Storing and retrieving data on the Network.
```js
//  Storing data
let item = node.store({key: key, value: value});   //  If no key is provided it will default to the hash of the value stored

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

# **Communication**
Broadcasting to the whole Network.
```js
//  Sendind to the Network
node.broadcast({data: data});

//  Handling incoming Broadcasts
node.on("broadcast", (data) => {
    console.log(data);
});
```

# **Documentation**
* [Node](https://github.com/Nephys/plexus/blob/main/docs/node.md)
* [Item](https://github.com/Nephys/plexus/blob/main/docs/item.md)
* [Message](https://github.com/Nephys/plexus/blob/main/docs/message.md)
* [Router](https://github.com/Nephys/plexus/blob/main/docs/router.md)

# **TODO**
- [X] Implement keep alive (ping contacts to keep the UDP hole open)*
- [X] Implement Item expiration
- [X] Implement Item propagation
- [X] Improve the storage system
- [ ] Clean up code
- [X] Finish implementing error handling using exceptions
- [ ] Add documentation
###### * (WIP)

# **Support Me 🤝**

If you like the project and want to support me you can do so by donating any amout to one of the following addresses or by using it in your own projects and showing it to other developers.

Tank you! ❤️

* ETH [0x882fc9954991eaaa4c8f2de9145e3135660a1680](https://etherscan.io/address/0x882fc9954991eaaa4c8f2de9145e3135660a1680)

* BTC [bc1q3ehnqqmckv7g45hy8su65q88h6arnfy7ar2tgt](https://btc.com/bc1q3ehnqqmckv7g45hy8su65q88h6arnfy7ar2tgt)

\
\
[@Nephys](https://github.com/Nephys), 2021