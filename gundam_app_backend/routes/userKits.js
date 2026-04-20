const express = require("express");
const router = express.Router();

const UserKit = require("../models/UserKits");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Invalid user token" });
    }

    const userKits = await UserKit.find({ user: userId }).populate("kit");

    res.json(userKits);
  } catch (error) {
    console.error("GET /userkits error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { kitId, status } = req.body;

    const userId = req.user?.id || req.user?._id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Invalid user token" });
    }

    let userKit = await UserKit.findOne({
      user: req.user.id,
      kit: kitId,
    });

    // if no userKit, need to create; else just update
    if (!userKit) {
      userKit = new UserKit({
        user: req.user.id,
        kit: kitId,
        status: status,
      });
    } else {
      userKit.status = status;
    }

    await userKit.save();

    res.json(userKit);
  } catch (err) {
    console.error("USERKITS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;