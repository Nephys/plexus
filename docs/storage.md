# **Storage**

The local storage used to store [items](item.md) on the node.

# **Contents**

* constructor
    * [new Storage()](#new-storage)
* methods
    * [storage.has(key)](#storagehaskey)
    * [storage.get(key)](#storagegetkey)
    * [storage.set(key, value, republish)](#storagesetkey-value-republish)
    * [storage.delete(key)](#storagedeletekey)
    * [storage.get_republishable_items()](#storageget_republishable_items)
    * [storage.get_items()](#storageget_items)

# **Constructor**

#### new Storage()

\
**Creates a new Storage instance.**
```js
const plexus = require("plexus");

let storage = new plexus.Storage();
```

# **Methods**

#### storage.has(key)
* `key`: _String_ The key of the item to look for.

\
**Checks if an item with the specified key is already stored.**
```js
//  Is an item with the key "key" already stored
storage.has("key");
```

#### storage.get(key)
* `key`: _String_ The key of the item to look for.

\
**Returns the item with the specified key.**
```js
//  Get the item with the key "key" from the storage
storage.get("key");
```

#### storage.set(key, value, republish)
* `key`: _String_ The key of the item used to retrieve it.
* `value`: _Object_ The data to store in the item.
* `republish`: _Boolean_ _(Default: false)_ Whether or not the item should be republished after it expires.

\
**Stores an item on the node.**
```js
let item = new plexus.Item({key: "key", value: "data", publisher: "id", timestamp: 0});

//  Store an item that wont be republished after it expires
storage.set("key", item, false);
```

#### storage.delete(key)
* `key`: _String_ The key of the item to delete.

\
**Removes an item from the node.**
```js
//  Remove the item with the key "key" from the storage
storage.delete("key");
```

#### storage.get_republishable_items()

#### storage.get_items()