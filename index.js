const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let clients = [];

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// returns on successful login a code for which is used to authenticate clients for future requests
app.post("/reg", (req, res) => {
    const clientName = req.body.clientName;
    if (!clientName || clients.find(cl => cl.name === clientName)) {
        res.send("Error registering under this clientName. Potentially already registered.");
        return;
    }
    const code = Math.floor(Math.random() * 10000);
    clients.push({name: clientName, code: code});
    res.send({clientCode: code});
    console.log(clients)
})

app.post("/visible", (req, res) => {
    const clientName = req.body.clientName;
    const clientCode = req.body.clientCode;

    const clientNames = clients.map(client => client.name);
    const client = clients.find(client => client.name === clientName);
    if (clientNames && client) {
        if (!clientNames.includes(clientName) || client.code !== clientCode) {
            res.send("error, wrong code");
        } else {
            client.authenticated = true;
            res.send("successfully logged in!");
        }
    } else {
        res.send("client not registered yet");
    }
});


app.post("/match", (req, res) => { //the client that wants to match with randomly chosen other client needs to provide their own code for authorization.
    const clientCode = req.body.clientCode;
    const otherClient = clients.find(cl => cl.authenticated && !cl.code !== clientCode);
    const thisClient = clients.find(cl => cl.authenticated && cl.code === clientCode);

    if (thisClient && otherClient && thisClient.name !== otherClient.name) {
        thisClient.activeMatchWith = otherClient.name;
        otherClient.activeMatchWith = thisClient.name;
        res.send(` successfully matched with other client: ${otherClient.name}`);
        console.log(clients);
    } else {
        res.send("client mismatch");
    }
})

app.get("/clients", (req, res) => {
    res.json(clients.filter(cl => cl.authenticated).map(cl => cl.name));
});

app.get("/matches", (req,res) => {
    res.send(clients.reduce((result, item) => {
        if (item.activeMatchWith) {
            // Ueberpruefe, ob das Paar schon im result-Array existiert
            if (!result.some(pair => pair.includes(item.name) && pair.includes(item.activeMatchWith))) {
                // Wenn nicht, fuege das Paar hinzu
                result.push([item.name, item.activeMatchWith].sort());
            }
        }
        return result;
    }, []));
})

app.post("/debugSetState", (req, res) => {
    clients = req.body;
    res.send(req.body)
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
