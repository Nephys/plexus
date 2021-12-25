const util = require("util");
const os = require("os");
const plexus = require("../index");

const stdin = process.stdin;
const stdout = process.stdout;

stdin.resume();
stdin.setEncoding("utf8");

const port = Math.floor(Math.random() * 6000 + 1);
const client_name = `${os.hostname()}_${port}`

const node = new plexus.Node({port: port});

let remote = null;

node.rpc.on("ready", () => {
    console.log(`client listening on ${node.self.name}`);
    node.on("broadcast", (data) => {
        if(data.type.toUpperCase() == "MESSAGE") {
            console.log(`[${data.metadata.sender}]: ${data.metadata.text}`);
        }
    });
    
    console.log("please enter the <IP:PORT> of the remote peer");
    stdin.on("data", (data) => {
        stdout.write("\033[1A" + `[${client_name}]: ${data.toString()}`);

        if(!remote) {
            const address = data.toString().replace(/\r?\n|\r/g, " ");
            const host = address.split(":")[0];
            const port = parseInt(address.split(":")[1]);
            const tmp_remote = {host, port};

            node.connect(tmp_remote).on("connected", () => {
                remote = tmp_remote;
                console.log(`[Welcome to the network, '${client_name}'!]`);
            });
        } else {
            try {
                const message_data = {
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