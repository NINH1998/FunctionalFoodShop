const ProductTag = require('../Model/ProductTag');
const StoreSchema = require('../Model/Product');

const getProductsByTag = async (req, res) => {
    const { tagId } = req.params;

    try {
        const products = await ProductTag.find({ tagId: tagId }).populate({
            path: 'productId',
        });
        const counts = await ProductTag.find({ tagId }).countDocuments();
        return res.status(200).json({ success: true, message: 'Tìm sản phảm thành công', products, counts });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Tìm sản phảm thất bại' });
    }
};

const getTagByProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const tags = await ProductTag.find({ productId: pid }).populate({
            path: 'tagId',
            select: 'title colorTag iconTag',
        });

        const tag = tags.map((el) => el.tagId);
        return res.status(200).json({ success: true, message: 'Tìm tag thành công', tag });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Tìm tag thất bại' });
    }
};

const createProductTag = async (req, res) => {
    const { pid } = req.params;
    const tags = req.body;
    try {
        const tagsProduct = await ProductTag.find({ productId: pid }).populate({
            path: 'tagId',
            select: 'title colorTag',
        });

        const existingTagIds = tagsProduct.map((tag) => tag.tagId.toString());

        for (let tag of tags) {
            if (!existingTagIds.includes(tag)) {
                await ProductTag.create({
                    productId: pid,
                    tagId: tag,
                });
            }
        }
        for (let existingTag of tagsProduct) {
            if (!tags.includes(existingTag.tagId.toString())) {
                await ProductTag.deleteOne({ _id: existingTag._id });
            }
        }

        return res.status(200).json({ success: true, message: 'Tạo tag sản phẩm thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Tạo tag sản phẩm thất bại' });
    }
};

const deleteProductTag = async (req, res) => {
    const { pid } = req.params;
    try {
        const tags = await ProductTag.deleteMany({ productId: pid });
        return res.status(200).json({ success: true, message: 'Tìm tag thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Tìm tag thất bại' });
    }
};

module.exports = { createProductTag, getTagByProduct, getProductsByTag, deleteProductTag };
