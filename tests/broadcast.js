const plexus = require("../index");

const a = new plexus.Node({id: "a"});
const b = new plexus.Node({id: "b", port: 8081});
const c = new plexus.Node({id: "c", port: 8082});

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

let ready = 0;

const update = () => {
    ready++;

    if(ready >= 3) {
        a.broadcast({data: "a speaking"});
        b.broadcast({data: "b speaking"});
        c.broadcast({data: "c speaking"});
    }
}

a.on("connected", (c) => {
    update();
});

b.on("connected", (c) => {
    update();
});

c.on("connected", (c) => {
    update();
});
