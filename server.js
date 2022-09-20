const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const app = express();

const DB_USER = "otaviopiotto";

const DB_PASS = encodeURIComponent("2DkswC3FCqrwvMYz");

const MONGODB_URI = process.env.MONGODB_URI;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4, // Use IPv4, skip trying IPv6
};

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@workoutapp.iuzexsr.mongodb.net/?retryWrites=true&w=majority`;

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

mongoose.connect(MONGODB_URI, options);

// mongoose
//   .connect(uri)
//   .then(() => {
//     app.listen(8000);
//     console.log("Conectado");
//   })
//   .catch((err) => console.log(err));
