# **Contact**

Contacts are used to store data about nodes such as their address and port needed for communication, their ID as well as their local logical clock.

# **Contents**

* constructor
    * [new Contact(options)](#new-itemoptions)
* methods

# **Constructor**

#### new Contact(options)

* `options`:
    * `host`: _String_ IP address of the node.
    * `port`: _Integer_ UDP port of the node.
    * `id`: _String_ The node ID.
    * `clock`: _VectorClock_ The node's Vector Clock.

\
**Creates a new Contact.**
```js
const plexus = require("plexus");

let contact = new plexus.Contact({});
```

# **Methods**
