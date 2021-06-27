# **Node**

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