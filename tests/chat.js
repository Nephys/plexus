const util = require("util");
const os = require("os");
const Plexus = require("../index");

const stdin = process.stdin;
const stdout = process.stdout;

stdin.resume();
stdin.setEncoding("utf8");

let remote = null;
let port = Math.floor(Math.random() * 6000 + 1);
let node = new Plexus.Node({port: port});

let client_name = `${os.hostname()}_${port}`

node.rpc.on("ready", () => {
    console.log(`client listening on ${node.self.name}`);
    node.on("broadcast", (message) => {
        let data = message.params.data;
        if(data.type.toUpperCase() == "MESSAGE") {
            console.log(`[${data.metadata.sender}]: ${data.metadata.text}`);
        }
    });

    node.rpc.on("message", (message, {host, port}) => {
        return;     // Ignore
        console.log(util.inspect(node.router.buckets, {showHidden: true, colors: true}));
    });
    
    console.log("please enter the <IP:PORT> of the remote peer");
    stdin.on("data", (data) => {
        stdout.write("\033[1A" + `[${client_name}]: ${data.toString()}`);

        if(!remote) {
            let address = data.toString().replace(/\r?\n|\r/g, " ");
            let host = address.split(":")[0];
            let port = parseInt(address.split(":")[1]);
            let tmp_remote = {host, port};

            node.connect(tmp_remote).on("connected", () => {
                remote = tmp_remote;
                console.log(`[Welcome to the network, '${client_name}'!]`);
            });
        } else {
            try {
                let message_data = {
                    type: "message",
                    
                    metadata: {
                        text: data.toString().replace(/\r?\n|\r/g, " "),
                        sender: client_name,
                        timestamp: new Date().getTime()
                    }
                };
                node.broadcast({data: message_data});
            } catch (error) {
                stdout.write(`[ERROR]: ${error.message}\n`);
            }
        }
    });
});