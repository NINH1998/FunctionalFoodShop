const BlogCategory = require('../Model/BlogCategory');

const getBlogCategory = async (req, res) => {
    try {
        const response = await BlogCategory.find().select('title');
        return res.status(200).json({ success: true, message: 'get category success', getCategory: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'get failue' });
    }
};

const createBlogCategory = async (req, res) => {
    try {
        const response = await BlogCategory.create(req.body);
        res.status(200).json({ success: true, message: 'create category success', createdCategory: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'create failue' });
    }
};

const updatedBlogCategory = async (req, res) => {
    const { pcid } = req.params;
    try {
        const response = await BlogCategory.findByIdAndUpdate(pcid, req.body, { new: true });
        res.status(200).json({ success: true, message: 'update category success', updatedCategory: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'update failue' });
    }
};

const deleteBlogCategory = async (req, res) => {
    const { pcid } = req.params;
    try {
        await BlogCategory.findByIdAndDelete(pcid);
        res.status(200).json({ success: true, message: 'delete category success' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'delete failue' });
    }
};

module.exports = { getBlogCategory, createBlogCategory, updatedBlogCategory, deleteBlogCategory };
