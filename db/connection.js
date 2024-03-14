const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//Connection
mongoose
  .connect(process.env.CONN_STR)
  .then(() => {
    console.log("DB connection successful.");
  })
  .catch((err) => {
    console.log(`DB connection error:${err}`);
  });
