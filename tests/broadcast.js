const Plexus = require("../index");

let a = new Plexus.Node();
let b = new Plexus.Node({port: 8081});
let c = new Plexus.Node({port: 8082});

a.on("broadcast", (message) => {
    console.log(`[A] ${message.params.data}`);
});

b.on("broadcast", (message) => {
    console.log(`[B] ${message.params.data}`);
});

c.on("broadcast", (message) => {
    console.log(`[C] ${message.params.data}`);
});

a.connect({host: b.self.host, port: b.self.port});
b.connect({host: a.self.host, port: a.self.port});
c.connect({host: b.self.host, port: b.self.port});

async function broadcast() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    a.broadcast({data: "a speaking"});
    b.broadcast({data: "b speaking"});
    c.broadcast({data: "c speaking"});

    await new Promise((resolve) => setTimeout(resolve, 5000));

    a.broadcast({data: "a speaking again"});
    b.broadcast({data: "b speaking again"});
    c.broadcast({data: "c speaking again"});
}

broadcast();