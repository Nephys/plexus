# **Bucket**

Buckets are used to store a finite amount of contact informations about other nodes.
Multiple buckets are used in the [router](router.md) to speed up the lookup process.

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
const bucket = new plexus.Bucket();
```

# **Getters**

#### bucket.size

\
**Returns the amount of known contacts.**
```js
//  Get the number of contacts
const size = bucket.size;
```

# **Methods**

#### bucket.get_contacts()

\
**Returns the list of known contacts.**
```js
//  Get the list of contacts
const contacts = bucket.get_contacts();
```

#### bucket.get_contact(index)
* `index`: _Integer_ The index of the contact to look for.

\
**Returns the contact stored at the specified index.**
```js
//  Get the contact at the head of the bucket
const head = bucket.get_contact(0);
```

#### bucket.get_index(contact)
* `contact`: [_Contact_](contact.md) The contact of which to get the index.

\
**Gets the index of a contact.**
```js
const contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

//  Get the first contact
const index = bucket.get_index(contact);
```

#### bucket.add_contact(contact)
* `contact`: [_Contact_](contact.md) The contact to add to the bucket.

\
**Adds a contact to the bucket.**
```js
const contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

bucket.add_contact(contact);
```

#### bucket.remove_contact(contact)
* `contact`: [_Contact_](contact.md) The contact to remove from the bucket.

\
**Removes a contact from the bucket.**
```js
const contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

bucket.remove_contact(contact);
```

#### bucket.has_contact(contact)
* `contact`: [_Contact_](contact.md) The contact to look for.

\
**Checks if the contact is stored in the bucket.**
```js
const contact = new plexus.Contact({host: "127.0.0.1", port: 8080});

const exists = bucket.has_contact(contact);
```