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
* events
    * [Event 'ready'](#event-ready)
    * [Event 'message'](#event-message)
    * [Event 'PING'](#event-PING)
    * [Event 'FIND'](#event-FIND)
    * [Event 'STORE'](#event-STORE)
    * [Event 'BROADCAST'](#event-BROADCAST)

# **Constructor**

#### new RPC(options)

* `options`:
    * `port`: _Integer_ _(Default: 8080)_ UDP port of the node.

\
**Creates a new RPC.**
```js
const plexus = require("plexus");

//  Creating a new RPC
const rpc = new plexus.RPC();
```

# **Methods**

#### rpc.create_id()

\
**Creates a pracket ID.**
```js
//  Create and ID for the packet to send
const id = rpc.create_id();
```

#### rpc.send_request({host, port}, id)
* `host`: _String_ IP address of the remote node.
* `port`: _Integer_ UDP port of the remote node.
* `id`: _String_ Request ID.

\
**Sends a request packet.**
```js
const host = "127.0.0.1";
const port = 8080;

const id = rpc.create_id();

rpc.send_request({host, port}, id);
```

#### rpc.send_acknowledge({host, port}, id)
* `host`: _String_ IP address of the remote node.
* `port`: _Integer_ UDP port of the remote node.
* `id`: _String_ Request ID.

\
**Sends an acknowledgement packet.**
```js
const host = "127.0.0.1";
const port = 8080;

//  Incoming request with ID = 63b8fa2e7d0af923fb0505340bcad6a5
const id = "63b8fa2e7d0af923fb0505340bcad6a5";

rpc.send_acknowledge({host, port}, id);
```

#### rpc.message_type(message)
* `message`: [_Message_](message.md) The messsage to get the type from.

\
**Returns the type of a message (REQUEST, RESPONSE or UNKNOWN).**
```js
//  Create a request
const request = new plexus.Message({ method: "remote method", params: {} });

//  Get the type of the message
const type = rpc.message_type(request);
console.log(type);  //  REQUEST (0)
```

#### rpc.handshake({host, port}, attempts, timeout)
* `host`: _String_ IP address of the remote node.
* `port`: _Integer_ UDP port of the remote node.
* `attempts`: _Integer_ _(Default: 60)_ The amount of requests to send.
* `timeout`: _Integer_ _(Default: 1000)_ The interval between requests.

\
**Initiates a handshake negotiation with a remote node.**
```js
const handshake = rpc.handshake({host, port}, attempts, timeout);

handshake.on("connected", () => {
    console.log("connected");
});

handshake.on("timeout", () => {
    console.log("timed out");
});
```

#### rpc.send_message(message, {host, port}, attempts, timeout)
* `message`: [_Message_](message.md) The messsage to send to the remote node.
* `host`: _String_ IP address of the remote node.
* `port`: _Integer_ UDP port of the remote node.
* `attempts`: _Integer_ _(Default: 60)_ The amount of requests to send.
* `timeout`: _Integer_ _(Default: 1000)_ The interval between requests.

\
**Sends a message to a remote node.**
```js
const request = new plexus.Message({ method: "remote method", params: {} });

const handshake = rpc.send_message(request, {host, port});

handshake.on("response", (message, {host, port}) => {
    console.log("request got a response");
});
```

# **Events**

#### Event 'ready'
Emitted when the RPC is ready.

#### Event 'message'
* `message`: [_Message_](message.md) The message sent to the node.
* `host`: _String_ IP address of the remote node.
* `port`: _Integer_ UDP port of the remote node.

#### Event 'PING'
* `message`: [_Message_](message.md) The message sent to the node.
* `host`: _String_ IP address of the remote node.
* `port`: _Integer_ UDP port of the remote node.

#### Event 'FIND'
* `message`: [_Message_](message.md) The message sent to the node.
* `host`: _String_ IP address of the remote node.
* `port`: _Integer_ UDP port of the remote node.

#### Event 'STORE'
* `message`: [_Message_](message.md) The message sent to the node.
* `host`: _String_ IP address of the remote node.
* `port`: _Integer_ UDP port of the remote node.

#### Event 'BROADCAST'
* `message`: [_Message_](message.md) The message sent to the node.
* `host`: _String_ IP address of the remote node.
* `port`: _Integer_ UDP port of the remote node.
