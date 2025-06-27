const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const { caption } = req.body;
  const imageUrl = req.file.path;
  const userId = req.user.id;

  try {
    const post = new Post({
      imageUrl,
      caption,
      postedBy: userId,
    });
    await post.save();
    res.status(201).json({ msg: "Post created", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "username")
      .populate("comments.postedBy", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user.id } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.commentOnPost = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            text,
            postedBy: req.user.id,
          },
        },
      },
      { new: true }
    ).populate("comments.postedBy", "username");
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    console.log("post owner:", post.postedBy.toString());
    console.log("request user:", req.user.id);

    // Check if logged-in user is the post owner
    if (post.postedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post." });
    }

    await post.deleteOne();
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
