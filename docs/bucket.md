# **Bucket**

Buckets are used to store a finite amount of contact informations about other nodes.
Multiple buckets are used in the router to speed up the lookup process.

# **Contents**

* constructor
    * [new Bucket()](#new-itemoptions)
* getters
    * [size](#size)
* methods
    * [get_contacts()](#get_contacts)
    * [get_contact(index)](#get_contactindex)
    * [get_index(contact)](#get_indexcontact)
    * [add_contact(contact)](#add_contactcontact)
    * [remove_contact(contact)](#remove_contactcontact)
    * [has_contact(contact)](#has_contactcontact)

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

#### size

\
**Returns the amount of known contacts.**
```js
//  Get the number of contacts
let size = bucket.size;
```

# **Methods**

#### get_contacts()

\
**Returns the list of known contacts.**
```js
//  Get the list of contacts
let contacts = bucket.get_contacts();
```

#### get_contact(index)

\
**Returns the contact stored at the specified index.**
```js
//  Get the contact at the head of the bucket
let head = bucket.get_contact(0);
```

#### get_index(contact)

\
**Gets the index of a contact.**
```js
let contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

//  Get the first contact
let index = bucket.get_index(contact);
```

#### add_contact(contact)

\
**Adds a contact to the bucket**
```js
let contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

bucket.add_contact(contact);
```

#### remove_contact(contact)

\
**Removes a contact from the bucket**
```js
let contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

bucket.remove_contact(contact);
```

#### has_contact(contact)

\
**Checks if the contact is stored in the bucket**
```js
let contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

let exists = bucket.has_contact(contact);
```