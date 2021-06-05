const Plexus = require("../index");

let a = new Plexus.Node();
a.rpc.on("ready", () => {
    let b = new Plexus.Node({contact: new Plexus.Contact({port: 4545})});

    b.rpc.on("ready", () => {
        a.connect(new Plexus.Contact({port: 4545}));
    });
});


// a.rpc.on("message", (message) => {console.log(message)});

// console.log(a.self.id);
// console.log(b.self.id);

// const util = require("util")
// console.log(util.inspect(a, {showHidden: true, colors: true}));

// console.log(new Plexus.Message({method: "ping", params: {id: a.self.id}}));