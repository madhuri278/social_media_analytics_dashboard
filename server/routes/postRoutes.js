const express = require('express');
const router = express.Router();
const { getPosts, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { validatePost } = require('../middleware/validationMiddleware');

// Protect all routes
router.use(protect);

router.route('/')
  .get(getPosts)
  .post(validatePost, createPost);

router.route('/:id')
  .put(validatePost, updatePost)
  .delete(deletePost);

module.exports = router;
