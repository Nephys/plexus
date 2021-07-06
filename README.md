# **Plexus**
[![License](https://img.shields.io/github/license/Nephys/plexus?style=flat-square)](LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@nephys/plexus?style=flat-square)](https://www.npmjs.com/package/@nephys/plexus)
[![node-current (scoped)](https://img.shields.io/node/v/@nephys/plexus?style=flat-square)](https://www.npmjs.com/package/@nephys/plexus)


>Dependency-free decentralized peer-to-peer network for storage and communication based on the [Kademlia](http://www.scs.stanford.edu/~dm/home/papers/kpos.pdf) distributed hash table.

# **Contents**
* [Installing](#installing)
* [Testing](#testing)
* [Quick Start](#quick-start)
* [Storage](#storage)
* [Communication](#communication)
* [Documentation](#documentation)
* [Resources](#resources)
* [TODO](#todo)
* [Support](#support-me-)
* [License](LICENSE)

# **Installing**
```
npm install @nephys/plexus --save
```

# **Testing**
```
npm run test
```
**This test will create a 50-Node Local Mesh Network and then go through the 4 following steps.**

Step | Description
------------ | -------------
Item lookup | Testing if nodes can find an item on the network
Node lookup | Testing if nodes can find another node on the network
Broadcasting test | Testing if a node can broadcast to the rest of the network
Non existent item lookup | Testing if nodes dont find non existent data on the network*
###### * (The lookup should timemout and fail)

<br>

```
npm run chat
```
**A demo CLI chat client to test communication between nodes.**

<br>

```
npm run broadcast
```
**Testing the broadcasting system between 3 node A, B & C where A & B know eachother, B & C know eachother as well and A & C don't know eachother but should be able to communicate regardless.**

```
//  Expected output:

[A] b speaking
[B] a speaking
[B] c speaking
[C] a speaking
[A] c speaking
[C] b speaking
```

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
let item = node.store({key: key, value: value, republish: true});   //  If no key is provided it will default to the hash of the value stored

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
###### (WIP, subject to forwarding loops under certain network conditions)
```js
//  Sendind to the Network
node.broadcast({data: data});

//  Handling incoming Broadcasts
node.on("broadcast", (data) => {
    console.log(data);
});
```

# **Documentation**
* [Node](docs/node.md)
* [Bucket](docs/bucket.md)
* [Contact](docs/contact.md)
* [Item](docs/item.md)
* [Message](docs/message.md)
* [Router](docs/router.md)
* [RPC](docs/rpc.md)
* [Storage](docs/storage.md)
* [Vector Clock](docs/vector_clock.md)

# **Resources**
* [Kademlia Visualizer](https://kelseyc18.github.io/kademlia_vis/basics/1/)
* [Kademlia Design Specification](http://xlattice.sourceforge.net/components/protocol/kademlia/specs.html)
* [Kademlia: A Peer-to-peer Information System Based on the XOR Metric](http://www.scs.stanford.edu/~dm/home/papers/kpos.pdf)
* [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

# **TODO**
- [X] ~~Implement keep alive (ping contacts to keep the UDP hole open)*~~
- [X] ~~Implement Item expiration~~
- [X] ~~Implement Item propagation~~
- [X] ~~Improve the storage system~~
- [X] ~~Clean up code~~
- [X] ~~Finish implementing error handling using exceptions~~
- [X] ~~Add documentation~~
- [x] ~~Make broadcasting faster (master & slave broadcasting nodes?) Complete rework~~
###### ~~* (WIP)~~

# **Support Me 🤝**

If you like the project and want to support me you can do so by donating any amout to one of the following addresses or by using it in your own projects and sharing this repo.

Tank you! ❤️

* ETH [0x882fc9954991eaaa4c8f2de9145e3135660a1680](https://etherscan.io/address/0x882fc9954991eaaa4c8f2de9145e3135660a1680)

* BTC [bc1q3ehnqqmckv7g45hy8su65q88h6arnfy7ar2tgt](https://btc.com/bc1q3ehnqqmckv7g45hy8su65q88h6arnfy7ar2tgt)

\
\
[@Nephys](https://github.com/Nephys), 2021