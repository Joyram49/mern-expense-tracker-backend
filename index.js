const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const exproutes = require("./routes/exproutes");
const mongoose = require("mongoose");

// app initialize
const app = express();
app.use(express.json());
app.use(cors());

const uri =
  "mongodb+srv://joy:joy123@expensetracker.a8lrzwj.mongodb.net/expenseTracker?retryWrites=true&w=majority";

// .env variables
require("dotenv").config({ path: "./.env" });
const port = process.env.PORT || 5000;

// database connection with mongoose
// mongoose.set("strictQuery", false);
// mongoose
//   .connect(process.env.ATLAS_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("database connected successfully"))
//   .catch((err) => console.log(err));

const connectDB = async () => {
  try {
    await mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// application routes
app.use("/exp", exproutes);

// default error handler
function errorHandler(err, req, res, next) {
  res.status(5000).json({ error: "request failed!" });
}
app.use(errorHandler);

// app listener
connectDB().then(() => {
  app.listen(port, () => {
    console.log("listening for requests");
  });
});
