const Blog = require('../Model/Blog');

const getBlogs = async (req, res) => {
    try {
        const response = await Blog.find();
        return res.status(200).json({ success: true, message: 'get blog success', getBlogs: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'get blog  failue' });
    }
};

const getBlog = async (req, res) => {
    const { bid } = req.params;
    const includeFiles = 'firstname , lastname';
    try {
        const response = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } })
            .populate('likes', includeFiles)
            .populate('dislikes', includeFiles);
        return res.status(200).json({ success: true, message: 'get blog success', getBlog: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'get blog  failue' });
    }
};

const createBlog = async (req, res) => {
    const { description, title, category } = req.body;
    if (!description || !title || !category) return res.status(400).json({ success: false, message: 'missing input' });
    try {
        const response = await Blog.create(req.body);
        res.status(200).json({ success: true, message: 'create blog success', createdBlog: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'create blog  failue' });
    }
};

const updateBlog = async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0) return res.status(400).json({ success: false, message: 'missing input' });
    try {
        const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
        res.status(200).json({ success: true, message: 'update blog success', updatedBlog: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'update blog  failue' });
    }
};

const deleteBlog = async (req, res) => {
    const { bid } = req.params;
    try {
        const response = await Blog.findByIdAndDelete(bid);
        res.status(200).json({ success: true, message: 'delete blog success', deleteBlog: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'delete blog  failue' });
    }
};

// LIKE VS DISLIKE

const likeBlog = async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) return res.status(404).json({ success: false, message: 'missing input' });
    try {
        const blog = await Blog.findById(bid);
        const alreadydislike = blog?.dislikes?.find((el) => el.toString() === _id);
        if (alreadydislike) {
            const response = await Blog.findByIdAndUpdate(
                bid,
                { $pull: { dislikes: _id }, isDisliked: false },
                { new: true },
            );
            return res.json({ success: true, rs: response });
        }

        const isLiked = blog?.likes?.find((el) => el.toString() === _id);
        if (isLiked) {
            const response = await Blog.findByIdAndUpdate(
                bid,
                { $pull: { likes: _id }, isLiked: false },
                { new: true },
            );
            return res.json({ success: true, rs: response });
        } else {
            const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id }, isLiked: true }, { new: true });
            return res.json({ success: true, rs: response });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Like failue' });
    }
};

const dislikeBlog = async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) return res.status(404).json({ success: false, message: 'missing input' });
    try {
        const blog = await Blog.findById(bid);
        const alreadyLike = blog?.likes?.find((el) => el.toString() === _id);
        if (alreadyLike) {
            const response = await Blog.findByIdAndUpdate(
                bid,
                { $pull: { likes: _id }, isLiked: false },
                { new: true },
            );
            return res.json({ success: true, rs: response });
        }

        const isDisLiked = blog?.dislikes?.find((el) => el.toString() === _id);
        if (isDisLiked) {
            const response = await Blog.findByIdAndUpdate(
                bid,
                { $pull: { dislikes: _id }, isDisliked: false },
                { new: true },
            );
            return res.json({ success: true, rs: response });
        } else {
            const response = await Blog.findByIdAndUpdate(
                bid,
                { $push: { dislikes: _id }, isDisliked: true },
                { new: true },
            );
            return res.json({ success: true, rs: response });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Dislike failue' });
    }
};

module.exports = { getBlogs, getBlog, createBlog, updateBlog, deleteBlog, likeBlog, dislikeBlog };
