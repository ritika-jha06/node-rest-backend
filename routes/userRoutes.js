const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Post = require("../models/Post");

// Get user profile by ID + their posts
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const posts = await Post.find({ postedBy: req.params.id }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Follow user
router.put("/follow/:id", auth, async (req, res) => {
  const followId = req.params.id;
  const currentUserId = req.user.id;

  try {
    await User.findByIdAndUpdate(followId, {
      $addToSet: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: followId },
    });
    res.json({ msg: "Followed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unfollow user
router.put("/unfollow/:id", auth, async (req, res) => {
  const unfollowId = req.params.id;
  const currentUserId = req.user.id;

  try {
    await User.findByIdAndUpdate(unfollowId, {
      $pull: { followers: currentUserId },
    });
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: unfollowId },
    });
    res.json({ msg: "Unfollowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
