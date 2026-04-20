const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  kitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gundam",
    required: true,
  },
  reviewText: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  kitImages: [
    {
      kitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gundam",
        required: true,
      },
      imageUrl: { type: String, required: true },
    },
  ],
  reviews: [reviewSchema],
});

module.exports = mongoose.model("User", userSchema);
