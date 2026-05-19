const express = require("express");
const router = express.Router();

const Rating = require("../models/Rating");
const Gundam = require("../models/Kits");
const auth = require("../middleware/auth");

router.post("/:kitId", auth, async (req, res) => {
  try {
    const { value } = req.body;

    const kitId = req.params.kitId;
    const userId = req.user.id;

    if (
      value !== null &&
      (typeof value !== "number" || value < 1 || value > 5)
    ) {
      return res.status(400).json({ message: "Invalid rating value" });
    }

    if (value === null) {
      await Rating.findOneAndDelete({
        user: userId,
        kit: kitId,
      });
    } else {
      await Rating.findOneAndUpdate(
        {
          user: userId,
          kit: kitId,
        },
        {
          value,
        },
        {
          upsert: true,
          new: true,
        },
      );
    }

    const ratings = await Rating.find({ kit: kitId });

    const ratingsCount = ratings.length;

    const averageRating =
      ratingsCount > 0
        ? ratings.reduce((sum, r) => sum + r.value, 0) / ratingsCount
        : 0;

    await Gundam.findByIdAndUpdate(kitId, {
      averageRating,
      ratingsCount,
    });

    res.json({
      averageRating,
      ratingsCount,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/:kitId/me", auth, async (req, res) => {
  try {
    const rating = await Rating.findOne({
      user: req.user.id,
      kit: req.params.kitId,
    });

    res.json({ value: rating ? rating.value : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
