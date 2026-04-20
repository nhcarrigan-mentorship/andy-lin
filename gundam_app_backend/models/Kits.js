const mongoose = require("mongoose");

const gundamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: String,
  series: String,
  releaseYear: Number,
  kitNumber: Number,
  imageUrl: String,
  instructionsUrl: String,
});

module.exports = mongoose.model("Gundam", gundamSchema);
