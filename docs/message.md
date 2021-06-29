# **Message**

Messages are used by nodes to communicate with one another and exchange data over the network.

# **Contents**

* methods
    * [new Message(options)](#new-messageoptions)

* events

#### new Message(options)

* `options`:
    * `id`: _String_ _(Optional, will be generated, only set it when responding)_ The message identifier, useful when responding to a request (Response ID should be the same as the Request ID).
    * **Request**
        * `method`: _String_ The name of the remote method to be invoked.
        * `params`: _Object_ The parameter values to be used during the invocation of the remote method.
    * **Response**
        * `result`: _Any_ The result of the invoked method.
        * `error`: _Error_ _(Optional)_ If any error occurs during the execution of the invoked method.
