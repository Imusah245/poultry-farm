const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');

const router = express.Router();

// Validation rules for blog post creation/update
const blogValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('excerpt').notEmpty().withMessage('Excerpt is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

// GET /api/blog - Public, returns published posts
router.get('/', getAllPosts);

// POST /api/blog - Auth protected, create new post
router.post('/', protect, blogValidation, validate, createPost);

// PUT /api/blog/:id - Auth protected, update existing post
router.put('/:id', protect, blogValidation, validate, updatePost);

// DELETE /api/blog/:id - Auth protected, remove post
router.delete('/:id', protect, deletePost);

module.exports = router;
