const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const api = require("./api");
const users = require("./users");
const config = require('../config');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(config.BUILD_DIR, { maxAge: "30d" }));
users.use(app);


app.get(config.API_BASE_PATH + "/initial-data", (req, res) => {
  api.getInitalData()
    .then(data => res.send(data))
    .catch(error => res.send(error));
});

app.get(config.API_BASE_PATH + "/products", (req, res) => {
  api.products(req.query)
    .then(data => res.send(data))
    .catch(error => res.send(error));
});

app.get(config.API_BASE_PATH + "/products/:id", (req, res) => {
  api.getProductDetail(req.params.id)
    .then(data => res.send(data))
    .catch(error => res.send(error));
});

app.post(config.API_BASE_PATH + "/paiement", (req, res) => {
  api.paiement(req.body)
    .then(data => res.send(data))
    .catch(error => res.send(error));
});

app.get('*', (req, res) => {
  res.sendFile(config.BUILD_DIR + '/index.html');
});



app.listen(config.PORT || 5000, () => console.log("Listening on http://localhost:" + (config.PORT || 5000)));