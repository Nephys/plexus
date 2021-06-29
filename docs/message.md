# **Message**

Messages are used by nodes to communicate with one another and exchange data over the network.

# **Contents**

* constructor
    * [new Message(options)](#new-messageoptions)
* methods
    * [message.create_id()](#messagecreate_id)
    * [message.serialize()](#messageserialize)
    * [message.message_type(specs)](#messagemessage_typespecs)

# **Constructor**

#### new Message(options)

* `options`:
    * `id`: _String_ _(Optional, will be generated, only set it when responding)_ The message identifier, useful when responding to a request (Response ID should be the same as the Request ID).
    * **Request**
        * `method`: _String_ The name of the remote method to be invoked.
        * `params`: _Object_ The parameter values to be used during the invocation of the remote method.
    * **Response**
        * `result`: _Any_ The result of the invoked method.
        * `error`: _Error_ _(Optional)_ If any error occurs during the execution of the invoked method.

\
**Creates a new Message to be sent over the network.**
```js
const plexus = require("plexus");

//  Create a request
let request = new plexus.Message({ method: "remote method", params: {} });

//  Create a response
let response = new plexus.Message({ result: "response", id: request.id });
```

# **Methods**

#### message.create_id()

\
**Creates a new ID for the message (request) to be used when responding.**
```js
//  Create a new message request ID
message.id = message.create_id();
```

#### message.serialize()

\
**Converts the message into a new buffer to be sent over the network.**
```js
//  Serialize the message before sending
let serialized = message.serialize();
```

#### message.message_type(specs)

* `specs`: _Object_ The message's options.

\
**Returns the type of the message (REQUEST, RESPONSE or UNKNOWN).**
```js
let specs = { method: "remote method", params: {} }
let type = message.message_type(specs);
```