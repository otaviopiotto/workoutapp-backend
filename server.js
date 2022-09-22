require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const app = express();

const MONGODB_URI = process.env.MONGODB_URI || "http://localhost:8000";

const options = {
  useNewUrlParser: true,
};

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use(express.json());

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "teste" });
});
mongoose.connect(MONGODB_URI, options).then(() => console.log("running"));

app.listen(process.env.PORT || 8000);
