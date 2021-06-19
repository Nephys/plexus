const util = require("util");
const os = require("os");
const Plexus = require("../index");

const stdin = process.stdin;
const stdout = process.stdout;

stdin.resume();
stdin.setEncoding("utf8");

let remote = null;
let port = Math.floor(Math.random() * 6000 + 1);
let node = new Plexus.Node({contact: new Plexus.Contact({port})});

node.rpc.on("ready", () => {
    node.rpc.on("DATA", (params, {host, port}) => {
        console.log(`[${params.sender}]: ${params.data}`);
    });

    node.rpc.on("message", (message, {host, port}) => {
        console.log(util.inspect(node.router.buckets, {showHidden: true, colors: true}));
    });
    
    console.log("please enter the <IP:PORT> of the remote peer");
    stdin.on("data", (data) => {
        stdout.write("\033[1A" + `[${os.hostname()}]: ${data.toString()}`);

        if(!remote) {
            let address = data.toString().replace(/\r?\n|\r/g, " ");
            let host = address.split(":")[0];
            let port = parseInt(address.split(":")[1]);
            let tmp_remote = {host, port};

            node.connect(tmp_remote).on("connected", () => {
                remote = tmp_remote;
            });
        } else {
            try {
                let message = new Plexus.Message({
                    method: "data",
                    params: {
                        data: data.toString().replace(/\r?\n|\r/g, " "),
                        sender: os.hostname(),
                        timestamp: new Date().getTime()
                    }
                });
                node.rpc.send_message(message.serialize(), remote).on("timeout", () => {
                    remote = null;
                    console.log("lost connectio to remote peer");
                    console.log("please enter the <IP:PORT> of the remote peer");
                });
            } catch (error) {
                stdout.write(`[ERROR]: ${error.message}\n`);
            }
        }
    });
});