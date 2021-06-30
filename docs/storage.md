# **Storage**



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

\
**Checks if an item with the specified key is already stored.**
```js
storage.has("key");
```

#### storage.get(key)

\
**Returns the item with the specified key.**
```js
storage.get("key");
```

#### storage.set(key, value, republish)

\
**Stores an item on the node.**
```js
storage.set(key, value, republish);
```

#### storage.delete(key)

\
**Removes an item from the node.**
```js
storage.delete(key);
```

#### storage.get_republishable_items()

#### storage.get_items()