const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    kit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kit",
      required: true,
    },

    value: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

ratingSchema.index({ user: 1, kit: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
