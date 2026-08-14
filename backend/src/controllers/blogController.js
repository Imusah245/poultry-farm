const BlogPost = require('../models/BlogPost');

/**
 * GET /api/blog
 * Public - Returns published blog posts sorted by createdAt descending.
 * Supports optional ?category= query param for filtering.
 */
const getAllPosts = async (req, res, next) => {
  try {
    const filter = { published: true };
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const posts = await BlogPost.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/blog
 * Auth protected - Creates a new blog post.
 * Requires title, content, excerpt, category in request body.
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, readTime, published } = req.body;

    const post = await BlogPost.create({
      title,
      content,
      excerpt,
      category,
      readTime,
      published: published !== undefined ? published : true,
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/blog/:id
 * Auth protected - Updates an existing blog post.
 * Validates title, content, category required. Updates updatedAt timestamp.
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, category, readTime, published } = req.body;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title;
    post.content = content;
    post.excerpt = excerpt !== undefined ? excerpt : post.excerpt;
    post.category = category;
    if (readTime !== undefined) post.readTime = readTime;
    if (published !== undefined) post.published = published;
    post.updatedAt = new Date();

    await post.save();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/blog/:id
 * Auth protected - Removes a blog post from the database.
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await BlogPost.findByIdAndDelete(id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};
