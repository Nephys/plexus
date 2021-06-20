const Plexus = require("../index");


// let bucket = new Plexus.Bucket();
// let contact_a = new Plexus.Contact({
//     id: "contact_a"
// });
// let contact_b = new Plexus.Contact({
//     id: "contact_b"
// });
// let contact_c = new Plexus.Contact({
//     id: "contact_c"
// });


// bucket.add_contact(contact_a); // Head
// bucket.add_contact(contact_b); // Head
// bucket.add_contact(contact_c); // Head

// // Tail?
// bucket.remove_contact(contact_b);
// bucket.add_contact(contact_b);


// console.log(bucket);

// return;


let a = new Plexus.Node();
let c = new Plexus.Node({port: 25565});

a.rpc.on("ready", () => {
    let b = new Plexus.Node({port: 4545});

    b.rpc.on("message", (message, {host, port}) => {
        // console.log(message);
    });

    b.rpc.on("ready", async () => {
        c.connect({host: "127.0.0.1", port: 4545});
        c.connect({host: "127.0.0.1", port: 8080});

        a.connect({host: "127.0.0.1", port: 4545});

        a.on("connected", async (contact) => {
            // a.rpc.send_message(new Plexus.Message({result: "DEBUG_MESSAGE"}), {host: "127.0.0.1", port: 4545});

            await new Promise((resolve) => setTimeout(resolve, 1000));
            // const util = require("util");
            

            // console.log("--------------- a ---------------");
            // console.log(util.inspect(a.router.buckets, {showHidden: true, colors: true}));
            // console.log(util.inspect(a.router.contacts, {showHidden: true, colors: true}));


            // console.log("--------------- b ---------------");
            // console.log(util.inspect(b.router.buckets, {showHidden: true, colors: true}));
            // console.log(util.inspect(b.router.contacts, {showHidden: true, colors: true}));


            // console.log("--------------- c ---------------");
            // console.log(util.inspect(c.router.buckets, {showHidden: true, colors: true}));
            // console.log(util.inspect(c.router.contacts, {showHidden: true, colors: true}));


            // console.log("--------------- final ---------------");
            // console.log(util.inspect(a, {showHidden: true, colors: true, depth: Infinity}));


            process.exit(0);
        });
    });

    // await new Promise((resolve) => setTimeout(resolve, 2500));
    // console.log(Buffer.from(JSON.stringify(a), "utf-8").toString());
    // console.log(a.self.clock.time);
    // console.log(b.self.clock.time);
    // const util = require("util");
    // console.log(util.inspect(a.self.clock.time, {showHidden: true, colors: true}));
    // process.exit(0);
});

// a.rpc.on("message", (message) => {console.log(message)});

// console.log(a.self.id);
// console.log(b.self.id);

// console.log(new Plexus.Message({method: "ping", params: {id: a.self.id}}));