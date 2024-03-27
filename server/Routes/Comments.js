const express = require('express');
const router = express.Router();
const Comment = require('../Controller/Comments');
const { verifyAccessToken } = require('../Middleware/VerifyToken');

router.get('/', Comment.getComments);
router.post('/', verifyAccessToken, Comment.createComment);
router.post('/reply/:commentId', verifyAccessToken, Comment.createReplies);
router.put('/like-comment/:commentId', verifyAccessToken, Comment.likeComment);
router.put('/dislike-comment/:commentId', verifyAccessToken, Comment.dislikeComment);
router.put('/like-reply', verifyAccessToken, Comment.likeReply);
router.put('/dislike-reply', verifyAccessToken, Comment.dislikeReply);
router.put('/edit-comment/:commentId', verifyAccessToken, Comment.editComment);
router.put('/edit-reply', verifyAccessToken, Comment.editReply);
router.delete('/delete-comment/:commentId', verifyAccessToken, Comment.deleteComment);
router.delete('/delete-reply', verifyAccessToken, Comment.deleteReply);

module.exports = router;
