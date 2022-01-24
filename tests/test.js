const EventEmitter = require("events");

const plexus = require("../index");

const a = new plexus.Node();

const pause = 1000;
const node_count = 50;
const nodes = [];

console.log(`Running local selftest with ${node_count} nodes`);

console.log(`Setting up nodes...`);
let start = a.self.port + 1;
while(nodes.length < node_count) {
    let node = new plexus.Node({port: start++});
    
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
    let listening_nodes = 0;
    const broadcast_data = "test_message";
    const broadcast_emitter = new EventEmitter();

    for(let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        const status = a.connect({host: node.self.host, port: node.self.port});
        status.on("response", async (message, {host, port}) => {
            connections++;
            node.on("broadcast", (data) => {
                if (data == broadcast_data) {
                    listening_nodes++;
                    if(listening_nodes >= nodes.length) {
                        broadcast_emitter.emit("complete");
                    }
                }
            });

            if(connections >= nodes.length) {
                const items = [
                    a.store({key: "key", value: "value"}),
                    a.store({value: "hashed_value"})
                ];
                console.log(`Stored items`);
                console.log(items);
                await new Promise((resolve) => setTimeout(resolve, pause / 2));

                //  Item lookup
                console.log("");
                console.log("");
                console.log("=============================");console.log("");
                
                console.log("Item lookup");
                console.log("Testing if nodes can find an item on the network");

                console.log("");console.log("=============================");
                console.log("");
                console.log("");
                await new Promise((resolve) => setTimeout(resolve, pause));
                console.log("Starting...");
                let start = process.hrtime();

                a.find({key: "key", type: "item"}).on("found", async (result) => {
                    console.log(result);
                    let end = process.hrtime(start);
                    console.log(`${end[0]}s ${parseFloat(end[1] / 1000000).toFixed(2)}ms`);

                    //  Node lookup
                    console.log("");
                    console.log("");
                    console.log("=============================");console.log("");
                    
                    console.log("Node lookup");
                    console.log("Testing if nodes can find another node on the network");

                    console.log("");console.log("=============================");
                    console.log("");
                    console.log("");
                    await new Promise((resolve) => setTimeout(resolve, pause));
                    console.log("Starting...");
                    start = process.hrtime();

                    a.find({key: result.publisher, type: "node"}).on("found", async (result) => {
                        console.log(result);
                        end = process.hrtime(start);
                        console.log(`${end[0]}s ${parseFloat(end[1] / 1000000).toFixed(2)}ms`);

                        //  Broadcasting test
                        console.log("");
                        console.log("");
                        console.log("=============================");console.log("");
                        
                        console.log("Broadcasting test");
                        console.log("Testing if a node can broadcast to the rest of the network");
                        console.log("");

                        console.log("");console.log("=============================");
                        console.log("");
                        console.log("");
                        await new Promise((resolve) => setTimeout(resolve, pause));
                        console.log("Starting...");
                        start = process.hrtime();
                        
                        a.broadcast({data: broadcast_data});
                        broadcast_emitter.once("complete", async () => {
                            console.log(`${listening_nodes}/${nodes.length} nodes listening - (${parseFloat((listening_nodes / nodes.length) * 100).toFixed(2)}%)`);
                            end = process.hrtime(start);
                            console.log(`${end[0]}s ${parseFloat(end[1] / 1000000).toFixed(2)}ms`);
                            
                            //  Non existent item lookup
                            console.log("");
                            console.log("");
                            console.log("=============================");console.log("");
                            
                            console.log("Non existent item lookup");
                            console.log("Testing if nodes dont find non existent data on the network");
                            console.log("");
                            console.log("(The lookup should timemout and fail)");

                            console.log("");console.log("=============================");
                            console.log("");
                            console.log("");
                            await new Promise((resolve) => setTimeout(resolve, pause));
                            console.log("Starting...");
                            start = process.hrtime();
                            
                            a.find({key: "notakey"}).on("timeout", async () => {
                                console.log("timed out");
                                end = process.hrtime(start);
                                console.log(`${end[0]}s ${parseFloat(end[1] / 1000000).toFixed(2)}ms`);

                                console.log(`selftest done`);
                                await new Promise((resolve) => setTimeout(resolve, pause));
                                process.exit(0);
                            });
                        });
                    });
                });
            }
        });
    }
});