# **Router**

The router is one of the most important parts of the network, its role is to structure the peer-to-peer network.

Structuring the network to make it more reliable by allowing nodes to stay interconnected directly or indirectly even in the event of one or more nodes going offline.

# **Contents**

* methods
    * [new Router(options)](#new-routeroptions)
    
* events

#### new Router(options)

* `options`:
    * `contact`: _Contact_ The node's local contact informations.
    * `rpc`: _RPC_ The remote procedure call class of the node.
    * `capacity`: _Integer_ The maximum amount of buckets to be stored in the router.
    * `peers`: _Integer_ The maximum amount of contacts to be stored per bucket.
