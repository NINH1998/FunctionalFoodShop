const express = require('express');
const router = express.Router();
const Blog = require('../Controller/Blog');
const { verifyAccessToken, isAdmin } = require('../Middleware/VerifyToken');

router.get('/', Blog.getBlogs);
router.get('/one/:bid', Blog.getBlog);
router.post('/', [verifyAccessToken, isAdmin], Blog.createBlog);
router.put('/:bid', [verifyAccessToken, isAdmin], Blog.updateBlog);
router.delete('/:bid', [verifyAccessToken, isAdmin], Blog.deleteBlog);
router.put('/like/:bid', verifyAccessToken, Blog.likeBlog);
router.put('/dislike/:bid', verifyAccessToken, Blog.dislikeBlog);

module.exports = router;
