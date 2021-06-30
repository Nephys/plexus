# **RPC**

The RPC allows the node to connect with other nodes, communicate with them as well as receiving messages from other nodes.

# **Contents**

* constructor
    * [new RPC(options)](#new-rpcoptions)
* methods
    * [rpc.create_id()](#rpccreate_id)
    * [rpc.error_handler(error)](#rpcerror_handlererror)
    * [rpc.message_handler(bytes, rinfo)](#rpcmessage_handlerbytes-rinfo)
    * [rpc.send_request({host, port}, id)](#rpcsend_requesthost-port-id)
    * [rpc.send_acknowledge({host, port}, id)](#rpcsend_acknowledgehost-port-id)
    * [rpc.on_request({host, port}, bytes)](#rpcon_requesthost-port-bytes)
    * [rpc.on_acknowledge({host, port}, bytes)](#rpcon_acknowledgehost-port-bytes)
    * [rpc.on_message({host, port}, bytes)](#rpcon_messagehost-port-bytes)
    * [rpc.message_type(message)](#rpcmessage_typemessage)
    * [rpc.handshake({host, port}, attempts, timeout)](#rpchandshakehost-port-attempts-timeout)
    * [rpc.send_message(message, {host, port}, attempts, timeout)](#rpcsend_messagemessage-host-port-attempts-timeout)

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
**Handles incoming messages.**

#### rpc.send_request({host, port}, id)

#### rpc.send_acknowledge({host, port}, id)

#### rpc.on_request({host, port}, bytes)

#### rpc.on_acknowledge({host, port}, bytes)

#### rpc.on_message({host, port}, bytes)

#### rpc.message_type(message)

#### rpc.handshake({host, port}, attempts, timeout)

#### rpc.send_message(message, {host, port}, attempts, timeout)