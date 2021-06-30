# **Bucket**

Buckets are used to store a finite amount of contact informations about other nodes.
Multiple buckets are used in the router to speed up the lookup process.

# **Contents**

* constructor
    * [new Bucket()](#new-itemoptions)
* getters
    * [bucket.size](#bucketsize)
* methods
    * [bucket.get_contacts()](#bucketget_contacts)
    * [bucket.get_contact(index)](#bucketget_contactindex)
    * [bucket.get_index(contact)](#bucketget_indexcontact)
    * [bucket.add_contact(contact)](#bucketadd_contactcontact)
    * [bucket.remove_contact(contact)](#bucketremove_contactcontact)
    * [bucket.has_contact(contact)](#buckethas_contactcontact)

# **Constructor**

#### new Bucket()

\
**Creates a new Bucket instance.**
```js
const plexus = require("plexus");

//  Bucket creation
let bucket = new plexus.Bucket();
```

# **Getters**

#### bucket.size

\
**Returns the amount of known contacts.**
```js
//  Get the number of contacts
let size = bucket.size;
```

# **Methods**

#### bucket.get_contacts()

\
**Returns the list of known contacts.**
```js
//  Get the list of contacts
let contacts = bucket.get_contacts();
```

#### bucket.get_contact(index)

\
**Returns the contact stored at the specified index.**
```js
//  Get the contact at the head of the bucket
let head = bucket.get_contact(0);
```

#### bucket.get_index(contact)

\
**Gets the index of a contact.**
```js
let contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

//  Get the first contact
let index = bucket.get_index(contact);
```

#### bucket.add_contact(contact)

\
**Adds a contact to the bucket.**
```js
let contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

bucket.add_contact(contact);
```

#### bucket.remove_contact(contact)

\
**Removes a contact from the bucket.**
```js
let contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

bucket.remove_contact(contact);
```

#### bucket.has_contact(contact)

\
**Checks if the contact is stored in the bucket.**
```js
let contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

let exists = bucket.has_contact(contact);
```