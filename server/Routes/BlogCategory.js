const express = require('express');
const router = express.Router();
const Blog = require('../Controller/BlogCategory');
const { verifyAccessToken, isAdmin } = require('../Middleware/VerifyToken');

router.get('/', Blog.getBlogCategory);
router.post('/', [verifyAccessToken, isAdmin], Blog.createBlogCategory);
router.put('/:pcid', [verifyAccessToken, isAdmin], Blog.updatedBlogCategory);
router.delete('/:pcid', [verifyAccessToken, isAdmin], Blog.deleteBlogCategory);

module.exports = router;
