const Plexus = require("../index");

let a = new Plexus.Node();

let node_count = 10;
let nodes = [];

let start = a.self.port + 1;
while(nodes.length < node_count) {
    let node = new Plexus.Node({port: start++});
    nodes.push(node);
}

a.rpc.on("ready", () => {
    let connections = 0;
    for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let status = a.connect({host: node.self.host, port: node.self.port});
        status.on("response", (message, {host, port}) => {
            connections++;

            if(connections >= nodes.length) {
                console.log("[Selftest]> STORE");
                a.store(Buffer.from("key").toString("utf-8"), {data: "value"});
            }
        });
    }
});