const express = require("express");
const router = express.Router();

const UserKit = require("../models/UserKit");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const userKits = await UserKit
        .find({ user: req.user.id})
        .populate("kit");

    res.json(userKits);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;