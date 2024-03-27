const commentSchema = require('../Model/Comments');
const { likeQueue, dislikeQueue, likeReplyQueue, dislikeReplyQueue } = require('../Schedule/Queue');

const getComments = async (req, res) => {
    const queries = { ...req.query };
    const excludeFiled = ['limit', 'sort', 'page', 'fileds'];
    excludeFiled.forEach((el) => delete queries[el]);
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchEl) => `$${matchEl}`);
    const formatQueries = JSON.parse(queryString);
    //  filter
    let queriesCommand;
    queriesCommand = commentSchema.find(formatQueries);

    // sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queriesCommand = queriesCommand.sort(sortBy);
    }

    // Fileds
    if (req.query.fileds) {
        const filed = req.query.fileds.split(',').join(' ');
        queriesCommand = queriesCommand.select(filed);
    }
    // Limit & page
    const page = +req?.query?.page || 1;
    const limit = +req.query.limit || +process.env.LIMIT_PRODUCT;
    const skip = (page - 1) * limit;
    queriesCommand.skip(skip).limit(limit);

    try {
        const comments = await queriesCommand
            .populate({ path: 'postedBy', select: 'firstname lastname avatar' })
            .populate({ path: 'commentOn', select: 'title category' })
            .populate({ path: 'replies.postedBy', select: 'firstname lastname avatar' });
        const counts = await commentSchema.find().countDocuments();
        res.json({ success: true, counts, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Can not get product' });
    }
};

const createComment = async (req, res) => {
    const { comment, productId } = req.body;
    const { _id } = req.user;

    if (!comment) return res.status(400).json({ success: false, message: 'Hãy nhập bình luận' });
    try {
        const newComment = await commentSchema.create({
            text: comment,
            postedBy: _id,
            commentOn: productId,
        });
        return res.status(200).json({ success: true, message: 'Gửi bình luận thành công', comments: newComment });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi bình luận' });
    }
};

const createReplies = async (req, res) => {
    const { reply } = req.body;
    const { commentId } = req.params;
    const { _id } = req.user;
    if (!reply) return res.status(400).json({ success: false, message: 'Missing inputs' });
    try {
        const comment = await commentSchema.findById(commentId);
        comment.replies.push({ text: reply, postedBy: _id });
        await comment.save();
        return res.status(200).json({ success: true, message: 'Phản hồi thành công', comment });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi phản hồi' });
    }
};

const likeComment = async (req, res) => {
    const { commentId } = req.params;
    const { _id } = req.user;

    try {
        await likeQueue.add({ commentId, _id }, { delay: 500 });
        return res.status(200).json({ success: true, message: 'Like thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi ' });
    }
};

const dislikeComment = async (req, res) => {
    const { commentId } = req.params;
    const { _id } = req.user;

    try {
        await dislikeQueue.add({ commentId, _id }, { delay: 500 });
        return res.status(200).json({ success: true, message: 'Dislike thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi' });
    }
};

const likeReply = async (req, res) => {
    const { commentId, replyId } = req.body;
    const { _id } = req.user;

    try {
        await likeReplyQueue.add({ commentId, _id, replyId }, { delay: 500 });
        return res.status(200).json({ success: true, message: 'Like thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi' });
    }
};

const dislikeReply = async (req, res) => {
    const { commentId, replyId } = req.body;
    const { _id } = req.user;

    try {
        await dislikeReplyQueue.add({ commentId, _id, replyId }, { delay: 500 });
        return res.status(200).json({ success: true, message: 'Dislike thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi' });
    }
};

const editComment = async (req, res) => {
    const { commentId } = req.params;
    const { editedComment } = req.body;
    const { _id } = req.user;

    try {
        const comment = await commentSchema.findById(commentId);
        if (!comment) {
            return res.status(400).json({ success: false, message: 'Không tìm thấy bình luận' });
        }

        if (comment.postedBy.toString() !== _id) {
            return res.status(400).json({ success: false, message: 'Không có quyền chỉnh sửa' });
        }

        await commentSchema.findByIdAndUpdate(commentId, { text: editedComment }, { new: true });
        return res.status(200).json({ success: true, message: 'Sửa thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi' });
    }
};

const editReply = async (req, res) => {
    const { editedReply, commentId, replyId } = req.body;
    const { _id } = req.user;
    try {
        const comment = await commentSchema.findById(commentId);
        if (!comment) {
            return res.status(400).json({ success: false, message: 'Không tìm thấy bình luận' });
        }
        const reply = comment.replies.find((el) => el._id.toString() === replyId);
        if (reply.postedBy.toString() !== _id) {
            return res.status(400).json({ success: false, message: 'Không có quyền chỉnh sửa' });
        }

        const updatedComment = await commentSchema.findOneAndUpdate(
            {
                _id: commentId,
                'replies._id': replyId,
            },
            {
                $set: {
                    'replies.$.text': editedReply,
                },
            },
            { new: true },
        );

        return res.status(200).json({ success: true, message: 'Xóa bình luận thành công', updatedComment });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi' });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const { _id } = req.user;
    try {
        const comment = await commentSchema.findById(commentId);
        if (!comment) {
            return res.status(400).json({ success: false, message: 'Không tìm thấy bình luận' });
        }

        if (comment.postedBy.toString() !== _id) {
            return res.status(400).json({ success: false, message: 'Không có quyền xóa' });
        }

        const rs = await commentSchema.findByIdAndDelete(commentId);
        return res.status(200).json({ success: true, message: 'Xóa bình luận thành công', rs });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi' });
    }
};

const deleteReply = async (req, res) => {
    const { commentId, replyId } = req.body;
    const { _id } = req.user;
    try {
        const comment = await commentSchema.findById(commentId);
        if (!comment) return res.status(400).json({ success: false, message: 'Không tìm thấy bình luận' });

        for (const reply of comment.replies) {
            if (reply.postedBy.toString() !== _id) {
                return res.status(400).json({ success: false, message: 'Không có quyền xóa' });
            }
        }
        await commentSchema.findByIdAndUpdate(
            commentId,
            { $pull: { replies: { _id: { $in: replyId } } } },
            { new: true },
        );
        return res.status(200).json({ success: true, message: 'Xóa bình luận thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi' });
    }
};

module.exports = {
    getComments,
    createComment,
    createReplies,
    likeComment,
    dislikeComment,
    likeReply,
    dislikeReply,
    deleteComment,
    deleteReply,
    editReply,
    editComment,
};
