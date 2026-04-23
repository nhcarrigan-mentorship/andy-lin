const express = require("express");
const router = express.Router();

const UserKit = require("../models/UserKits");
const auth = require("../middleware/auth");
require("../models/Kits");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

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

    const userId = req.user.id; 

    let userKit = await UserKit.findOne({
      user: userId,
      kit: kitId,
    });

    if (!userKit) {
      userKit = new UserKit({
        user: userId,
        kit: kitId,
        status,
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
});

router.delete("/:kitId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { kitId } = req.params;

    const deleted = await UserKit.findOneAndDelete({
      user: userId,
      kit: kitId,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Kit not found in collection" });
    }

    res.json({ message: "Removed from collection" });
  } catch (err) {
    console.error("DELETE /userkits error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;