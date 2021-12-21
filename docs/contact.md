# **Contact**

Contacts are used to store data about nodes such as their address and port needed for communication, their ID as well as their local logical [clock](vector_clock.md).

# **Contents**

* constructor
    * [new Contact(options)](#new-contactoptions)
* getters
    * [contact.name](#contactname)
* methods
    * [contact.generate_id](#contactgenerate_id)

# **Constructor**

#### new Contact(options)

* `options`:
    * `host`: _String_ IP address of the node.
    * `port`: _Integer_ UDP port of the node.
    * `id`: _String_ _(Optional, if none is provided one will be generated)_ The node ID.
    * `clock`: [_VectorClock_](vector_clock.md) _(Optional, if none is provided one will be created and start at time = 0)_ The node's Vector Clock.

\
**Creates a new Contact.**
```js
const plexus = require("plexus");

//  Creating a new Contact
const contact = new plexus.Contact({
    host: "127.0.0.1",
    port: 8080
});
```

# **Getters**

#### contact.name

\
**Returns full address of the contact as _`IP:PORT`_.**
```js
const address = contact.name;
console.log(address);   //  127.0.0.1:8080
```

# **Methods**

#### contact.generate_id()

\
**Generates a unique contact ID (should only be used for the local node when an ID is not provided).**