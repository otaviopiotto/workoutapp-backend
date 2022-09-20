const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  exercise: String,
  sets: String,
  repetition: String,
  time: String,
  observation: String,
});
const daysSchema = new mongoose.Schema({
  number: Number,
  muscle_group: String,
  workout: [exerciseSchema],
});

const groupSchema = new mongoose.Schema({
  title: String,
  description: String,
  days: [daysSchema],
});

const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  name: { type: String, require: true },
  password: { type: String, require: true },
  group: [{ type: mongoose.Types.ObjectId, ref: "Group" }],
});

const Group = mongoose.model("Group", groupSchema);
const User = mongoose.model("User", userSchema);

module.exports = { User, Group };
