const Plexus = require("../index");

let a = new Plexus.Node();

let node_count = 5;
let nodes = [];

console.log(`Running local selftest with ${node_count} nodes`);

console.log(`Setting up nodes...`);
let start = a.self.port + 1;
while(nodes.length < node_count) {
    let node = new Plexus.Node({port: start++});
    
    let previous_node = nodes[nodes.length - 1];
    if(previous_node) {
        node.rpc.on("ready", () => {
            node.connect({host: previous_node.self.host, port: previous_node.self.port});
        });
    }

    nodes.push(node);
}

a.on("ready", () => {
    let connections = 0;
    for(let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let status = a.connect({host: node.self.host, port: node.self.port});
        status.on("response", async (message, {host, port}) => {
            connections++;

            if(connections >= nodes.length) {
                a.store({key: "key", value: "value"});
                a.store({value: "hashed_value"});
                await new Promise((resolve) => setTimeout(resolve, 2500));

                //  Item lookup
                console.log("");
                console.log("");
                console.log("=============================");console.log("");
                
                console.log("Item lookup");
                console.log("Testing if nodes can find an item on the network");

                console.log("");console.log("=============================");
                console.log("");
                console.log("");
                await new Promise((resolve) => setTimeout(resolve, 5000));
                console.log("Starting...");
                a.find({key: "key"}).on("found", async (result) => {
                    console.log(result);

                    //  Node lookup
                    console.log("");
                    console.log("");
                    console.log("=============================");console.log("");
                    
                    console.log("Node lookup");
                    console.log("Testing if nodes can find another node on the network");

                    console.log("");console.log("=============================");
                    console.log("");
                    console.log("");
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    console.log("Starting...");
                    a.find({key: result.publisher}).on("found", async (result) => {
                        console.log(result);

                        //  Non existent item lookup
                        console.log("");
                        console.log("");
                        console.log("=============================");console.log("");
                        
                        console.log("Non existent item lookup");
                        console.log("Testing if nodes dont find non existent data on the network");
                        console.log("");
                        console.log("(The lookup should tiemout and fail)");

                        console.log("");console.log("=============================");
                        console.log("");
                        console.log("");
                        await new Promise((resolve) => setTimeout(resolve, 5000));
                        console.log("Starting...");
                        a.find({key: "notakey"}).on("timeout", async () => {
                            console.log("timed out");
                            console.log("DONE");

                            a.broadcast({data: "DONE"});

                            await new Promise((resolve) => setTimeout(resolve, 5000));
                            process.exit(0);
                        });
                    });
                });
            }
        });
    }
});