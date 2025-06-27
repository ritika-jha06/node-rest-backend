const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const parser = require("../middleware/multer");
const { deletePost } = require("../controllers/postController");
const {
  createPost,
  getAllPosts,
  likePost,
  unlikePost,
  commentOnPost,
} = require("../controllers/postController");

// Create Post (with image)
router.post("/create", auth, parser.single("image"), createPost);

// Get All Posts
router.get("/", auth, getAllPosts);

// Like a Post
router.put("/like/:id", auth, likePost);

// Unlike a Post
router.put("/unlike/:id", auth, unlikePost);

// Comment on a Post
router.post("/comment/:id", auth, commentOnPost);

// Delete a post
router.delete("/delete/:id", auth, deletePost);

module.exports = router;
