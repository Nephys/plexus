const Plexus = require("../index");

let a = new Plexus.Node();

let node_count = 15;
let nodes = [];

let start = a.self.port + 1;
while(nodes.length < node_count) {
    let node = new Plexus.Node({port: start++});
    nodes.push(node);
}


console.log(`Running local selftest with ${nodes.length} nodes`);

a.rpc.on("ready", () => {
    let connections = 0;
    for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let status = a.connect({host: node.self.host, port: node.self.port});
        status.on("response", (message, {host, port}) => {
            connections++;

            if(connections >= nodes.length) {
                console.log(`[selftest] storage`);
                a.store({key: "key", value: "value"});
                a.store({value: "hashed_value"});

                a.find({key: "key"}).once("response", (message, {host, port}) => {
                    console.log(message);
                });
            }
        });
    }
});