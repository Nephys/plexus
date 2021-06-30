const plexus = require("../index");

let a = new plexus.Node();
let b = new plexus.Node({port: 8081});
let c = new plexus.Node({port: 8082});

a.on("broadcast", (data) => {
    console.log(`[A] ${data}`);
});

b.on("broadcast", (data) => {
    console.log(`[B] ${data}`);
});

c.on("broadcast", (data) => {
    console.log(`[C] ${data}`);
});

a.connect({host: b.self.host, port: b.self.port});
b.connect({host: a.self.host, port: a.self.port});
c.connect({host: b.self.host, port: b.self.port});

async function broadcast() {
    await new Promise((resolve) => setTimeout(resolve, 2500));
    a.broadcast({data: "a speaking"});
    b.broadcast({data: "b speaking"});
    c.broadcast({data: "c speaking"});

    await new Promise((resolve) => setTimeout(resolve, 5000));

    a.broadcast({data: "a speaking again"});
    b.broadcast({data: "b speaking again"});
    c.broadcast({data: "c speaking again"});
}

broadcast();