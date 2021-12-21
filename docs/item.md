# **Item**

Items are used to store and retrieve data on the network.

# **Contents**

* constructor
    * [new Item(options)](#new-itemoptions)
* methods
    * [item.create_hash(data)](#itemcreate_hashdata)

# **Constructor**

#### new Item(options)

* `options`:
    * `key`: _String_ _(Optional, if none is provided it will be set to the hash of the value to store)_ The key used to find and store the value on the network.
    * `value`: _Object_ The value to store on the network.
    * `publisher`: _String_ The ID of the node that published the Item on the network.
    * `timestamp`: _Integer_ Unix timestamp of the creation of the Item.

\
**Creates an Item to be stored on the network.**
```js
const plexus = require("plexus");

const item = new plexus.Item({key: key, value: value, publisher: "id", timestamp: 0});
```

# **Methods**

#### item.create_hash(data)

\
**Creates a hash of the input data.**
```js
//  Use the hash of the item's data as its key
item.key = item.create_hash(item.value);
```
