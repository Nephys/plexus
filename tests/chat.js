const os = require("os");
const Plexus = require("../index");

let port = 4545;

let remote = new Plexus.Contact({host: "EXTERNAL IP", port: port});

let node = new Plexus.Node({
    contact: new Plexus.Contact({port: port})
});

node.rpc.on("ready", () => {
    node.rpc.on("message", (message) => {
        console.log(message);
    });

    node.connect(remote);
});

// live console
const stdin = process.stdin;
const stdout = process.stdout;

stdin.resume();
stdin.setEncoding("utf8");

stdin.on("data", (data) => {
    // stdout.write("\033[1A" + `[TERMINAL]: ${data.toString()}`);
    stdout.write("\033[1A" + `[${os.hostname()}]: ${data.toString()}`);
    try {
        let message = new Plexus.Message({
            method: "data",
            params: {
                data: data.toString().replace(/\r?\n|\r/g, " "),
                sender: os.hostname(),
                timestamp: new Date().getTime()
            }
        });
        node.rpc.send_message(message.serialize(), remote);
    } catch (error) {
        stdout.write(`[ERROR]: ${error.message}\n`);
    }
});