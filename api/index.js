const express = require("express");
const cors = require("cors");

const apiRoutes = require("./routes/api");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api", apiRoutes);

app.use("/", (req, res) => {
  res.status(200).send("hello");
});

module.exports = app;
