# **VectorClock**

The vector clock is used to keep track of the logical time of the node.

The vector clock is useful when updating a remote node's [contact](contact.md) informations in the [router](router.md).

# **Contents**

* constructor
    * [new VectorClock(options)](#new-vectorclockoptions)
* getters
    * [vector_clock.time](#vector_clocktime)
* methods
    * [vector_clock.update(id)](#vector_clockupdateid)

# **Constructor**

#### new VectorClock(options)

* `options`:
    * `start`: _Integer_ _(Default: 0)_ Starting time of the clock.

\
**Creates a new Vector Clock.**
```js
const plexus = require("plexus");

//  Creating a new Vector Clock
const clock = new plexus.VectorClock();
```

# **Getters**

#### vector_clock.time

\
**Returns the current logical time of the node.**
```js
const time = clock.time;
console.log(time);  //  15
```

# **Methods**

#### vector_clock.update(id)
* `id`: _String_ _(Optional, Default: null)_ The ID of the node that caused the update.

\
**Updates the logical time of the node.**
```js
//  Node 0xa6564bce963cbfb2e841d2c94d450368c1463b235fb70fb27f2f69285cacf8ed caused an update
clock.update("0xa6564bce963cbfb2e841d2c94d450368c1463b235fb70fb27f2f69285cacf8ed");
```