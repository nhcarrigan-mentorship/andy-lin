const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400) 
      .json({ message: "All fields are required" });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    const validPassword = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !validPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful", 
      token,
      userId: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -email");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

router.get("/:username", async (req, res) => {
  try {
    //console.log("Searching for:", req.params.username);

    const user = await User.findOne({
      username: {
        $regex: `^${req.params.username}$`,
        $options: "i",
      },
    }).select("-password -email");

    //console.log("Found user:", user)

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Get public profile error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.put("/update-pfp", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { pfpLink } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { pfpLink },
      { new: true },
    );

    res.json({
      message: "Profile picture updated",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/post", auth, async (req, res) => {
  try {
    const { kitName, kitImageLink } = req.body;

    const user = await User.findById(req.user.id);

    user.kitImages.push({
      kitName,
      imageUrl: kitImageLink,
    });

    await user.save();

    res.status(201).json({
      message: "Post created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("username pfpLink");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
