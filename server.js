const DB = require("./db/connection");
// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });
const express = require("express");
let app = express();
const userroute = require("./routes/userRoutes");
const port = 2323;

app.use(express.json());
app.use("/", userroute);

//Connection to start the server
app.listen(`${port}`, () => {
  console.log(`server has started on Port Number ${port}`);
});

module.exports = app;
