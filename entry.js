const mongoose = require("mongoose");

const EntrySchema = new mongoose.Schema({
  title: String,
  content: String,
  mood: String,
  date: String
});

module.exports = mongoose.model("Entry", EntrySchema);