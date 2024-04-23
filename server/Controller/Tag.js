const Tag = require('../Model/Tag');

const getTags = async (req, res) => {
    const queries = { ...req.query };
    const excludeFiled = ['limit', 'sort', 'page', 'fileds'];
    excludeFiled.forEach((el) => delete queries[el]);

    let commandQuery;
    commandQuery = Tag.find();

    const limit = +req.query.limit || 8;
    commandQuery.limit(limit);
    try {
        const tags = await commandQuery;
        return res.status(200).json({ success: true, message: 'Lấy tags thành công', tags });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lấy tags thất bại' });
    }
};

const createNewTag = async (req, res) => {
    const { title, colorTag } = req.body;
    if (req?.file) req.body.iconTag = req?.file?.path;
    try {
        const newTag = new Tag({
            title: title,
            colorTag: '#0891b2',
            iconTag: req.body.iconTag,
        });
        const newTags = await newTag.save();
        return res.status(200).json({ success: true, message: 'Tạo tag thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Tạo tag thất bại' });
    }
};

module.exports = { createNewTag, getTags };
