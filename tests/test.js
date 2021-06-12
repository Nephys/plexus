const Plexus = require("../index");

let a = new Plexus.Node();
a.rpc.on("ready", () => {
    let b = new Plexus.Node({contact: new Plexus.Contact({port: 4545})});

    b.rpc.on("ready", async() => {
        a.connect({host: "127.0.0.1", port: 4545});

        await new Promise((resolve) => setTimeout(resolve, 2500));
        // console.log(Buffer.from(JSON.stringify(a), "utf-8").toString());
        // console.log(a.self.clock.time);
        // console.log(b.self.clock.time);
        // const util = require("util");
        // console.log(util.inspect(a.self.clock.time, {showHidden: true, colors: true}));
        process.exit(0);
    });
});


// a.rpc.on("message", (message) => {console.log(message)});

// console.log(a.self.id);
// console.log(b.self.id);

// console.log(new Plexus.Message({method: "ping", params: {id: a.self.id}}));