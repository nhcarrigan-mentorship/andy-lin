const mongoose = require("mongoose");

const gundamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: String,
  series: String,
  releaseYear: Number,
  kitNumber: Number,
  imageUrl: String,
  instructionsUrl: String,
  averageRating: {
    type: Number,
    default: 0,
  },

  ratingsCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Gundam", gundamSchema);
