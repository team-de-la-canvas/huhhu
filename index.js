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

  if (!clients.includes(clientName)) {
    clients.push(clientName);
    res.send("successfully logged in: " + clientName);
  }
  res.send("already logged in!");
});

app.get("/clients", (req, res) => {
  res.json(clients);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
