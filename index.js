const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const clients = [];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", (req, res) => {
  const clientName = req.body.clientName;
  const clientCode = req.body.code;

  const clientNames= clients.map(client => client.name);
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

app.post("/auth", (req,res) => {
  // returns on successful login a code for which is used to authenticate clients for future requests
  const clientName = req.body.clientName;
  if(clients.find(cl=>cl.name===clientName)) {
    res.send("already authenticated under this clientName");
    return;
  }
  const code = Math.floor(Math.random() * 10000);
  clients.push({name: clientName, code: code});
  res.send({ code: code });
  console.log(clients)
})

app.get("/clients", (req, res) => {
  res.json(clients.filter(cl=>cl.authenticated).map(cl=>cl.name));
});

app.post("/match", (req, res) => { //the client that wants to match with randomly chosen other client needs to provide their own code for authorization.
    const clientCode = req.body.code;
    const otherClient = clients.find(cl => cl.authenticated && !cl.code !== clientCode);
    const thisClient = clients.find(cl => cl.authenticated && cl.code === clientCode);

    if (thisClient && otherClient) {
        thisClient.activeMatch = otherClient.name;
        otherClient.activeMatch = thisClient.name;
        res.send(` successfully matched with other client: ${otherClient.name}`);
        console.log(clients);
    }
    else {
        res.send("client mismatch");
    }


})
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
