const Post = require('../models/Post');

// @desc    Get all user posts
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Schedule a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { content, platforms, scheduledAt, status } = req.body;

    // Default status to draft if not specified
    let postStatus = status || 'draft';
    
    // If post is scheduled, ensure scheduledAt is provided
    if (postStatus === 'scheduled' && !scheduledAt) {
      res.status(400);
      throw new Error('Please specify a scheduled date/time for scheduled posts');
    }

    // Create a new post
    const post = new Post({
      userId: req.user._id,
      content,
      platforms,
      scheduledAt: postStatus === 'scheduled' ? new Date(scheduledAt) : null,
      status: postStatus,
      // If it starts published, give it a tiny kickstart of engagement
      metrics: postStatus === 'published' ? {
        likes: Math.floor(Math.random() * 15) + 5,
        shares: Math.floor(Math.random() * 5) + 1,
        comments: Math.floor(Math.random() * 3) + 1
      } : { likes: 0, shares: 0, comments: 0 }
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    const { content, platforms, scheduledAt, status } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this post');
    }

    post.content = content || post.content;
    post.platforms = platforms || post.platforms;
    post.status = status || post.status;
    
    if (post.status === 'scheduled') {
      if (scheduledAt) {
        post.scheduledAt = new Date(scheduledAt);
      } else if (!post.scheduledAt) {
        res.status(400);
        throw new Error('Please specify a scheduled date/time');
      }
    } else if (post.status === 'published') {
      post.scheduledAt = null;
      // If status changed to published, give it some metrics if it doesn't have any
      if (post.metrics.likes === 0) {
        post.metrics = {
          likes: Math.floor(Math.random() * 200) + 10,
          shares: Math.floor(Math.random() * 50) + 2,
          comments: Math.floor(Math.random() * 25) + 1,
        };
      }
    } else {
      post.scheduledAt = null;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check ownership
    if (post.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this post');
    }

    await post.deleteOne();
    res.json({ message: 'Post removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
