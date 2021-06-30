# **RPC**

The RPC allows the node to connect with other nodes, communicate with them as well as receiving messages from other nodes.

# **Contents**

* constructor
    * [new RPC(options)](#new-rpcoptions)
* methods

# **Constructor**

#### new RPC(options)

* `options`:
    * `port`: _Integer_ _(Default: 8080)_ UDP port of the node.

\
**Creates a new RPC.**
```js
const plexus = require("plexus");

//  Creating a new RPC
let rpc = new plexus.RPC();
```

# **Methods**

#### rpc.create_id()

\
**Creates a pracket ID.**

#### rpc.error_handler(error)

\
**Closes the socket if an error occurs.**

#### rpc.message_handler(bytes, rinfo)

\
**Handles incomung messages.**