const express = require("express");
const mongoose = require("mongoose");
const gunplaKit = require("./models/Kits");
const userRoutes = require("./routes/users")
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes)

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/kits", async (req, res) => {
  console.log("Received data:", req.body);
  try {
    const newKit = new gunplaKit(req.body);
    await newKit.save();
    console.log("Saved to DB:", newKit);
    res.status(201).json(newKit);
  } catch (error) {
    console.error("Error saving kit:", error);
    res.status(400).json({ message: error.message });
  }
});

app.get("/kits", async (req, res) => {
  try {
    const kits = await gunplaKit.find();
    res.json(kits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/kits/latest", async (req, res) => {
  try {
    const latestKit = await gunplaKit.findOne().sort({ _id: -1 });
    if (!latestKit) return res.status(404).json({ message: "No kits found" });
    await gunplaKit.findByIdAndDelete(latestKit._id);
    res.json({ message: "Deleted latest kit", deleted: latestKit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/kits", async (req, res) => {
  try {
    const result = await gunplaKit.deleteMany({});
    res.json({
      message: "All kits deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/kits/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid kit ID" });
  }

  try {
    const kit = await gunplaKit.findById(id);
    if (!kit) return res.status(404).json({ message: "Kit not found" });
    res.json(kit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// duplicate check
app.get("/kits-debug/duplicates", async (req, res) => {
  try {
    const kits = await gunplaKit.find();
    const byNumber = {};

    kits.forEach((k) => {
      if (!byNumber[k.kitNumber]) {
        byNumber[k.kitNumber] = [];
      }
      byNumber[k.kitNumber].push(k);
    });

    const duplicates = Object.values(byNumber).filter(
      (list) => list.length > 1
    );

    res.json(duplicates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = app;
