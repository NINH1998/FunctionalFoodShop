const ProductCategory = require('../Model/CategoryProducts');

const getProductCategory = async (req, res) => {
    try {
        const response = await ProductCategory.find();
        return res.status(200).json({ success: true, message: 'get category success', getCategory: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'get failue' });
    }
};

const createProductCategory = async (req, res) => {
    const { title, itemTitle } = req.body;
    try {
        if (!title || !itemTitle) {
            return res.status(400).json({ message: 'Missing Input' });
        }

        const titlExisting = await ProductCategory.findOne({ title });
        if (titlExisting) {
            return res.status(400).json({ message: 'Tiêu đề này đã tồn tại' });
        } else {
            const newCategoryProduct = new ProductCategory({
                title,
                listCategory: [{ itemTitle }],
            });
            const savedCategoryProduct = await newCategoryProduct.save();
            return res.status(200).json({ success: true, message: 'create category success', savedCategoryProduct });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'create failue' });
    }
};

const createTitleItem = async (req, res) => {
    const { pcid } = req.params;
    const { itemTitle } = req.body;
    try {
        const categoryProduct = await ProductCategory.findById(pcid);
        const alreadyExistingTitleItem = categoryProduct?.listCategory?.find((el) => el.itemTitle === itemTitle);

        if (alreadyExistingTitleItem) {
            return res.json({ message: 'Tiêu đề này đã tồn tại' });
        } else {
            categoryProduct.listCategory.push({ itemTitle });
            await categoryProduct.save();
            return res.json(categoryProduct);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'update failue' });
    }
};

const editTitle = async (req, res) => {
    const { pcid } = req.params;
    const { title } = req.body;
    try {
        const updatedCategory = await ProductCategory.findByIdAndUpdate(pcid, { $set: { title: title } }, { new: true });
        return res.status(200).json({ success: true, mes: 'Chỉnh sửa thành công', updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'update failue' });
    }
};

const editTitleItem = async (req, res) => {
    const { pcid } = req.params;
    const { itemTitle, itemId } = req.body;
    try {
        const updatedCategory = await ProductCategory.findOneAndUpdate(
            { _id: pcid, 'listCategory._id': itemId },
            { $set: { 'listCategory.$.itemTitle': itemTitle } },
            { new: true },
        );
        return res.status(200).json({ success: true, mes: 'Chỉnh sửa thành công', updatedCategory });
    } catch (error) {
        res.status(500).json({ success: false, message: 'update failue' });
    }
};

const deleteProductCategory = async (req, res) => {
    const { pcid } = req.params;
    try {
        await ProductCategory.findByIdAndDelete(pcid);
        res.status(200).json({ success: true, message: 'delete category success' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'delete failue' });
    }
};

const deleteProductCategoryItem = async (req, res) => {
    const { pcid } = req.params;
    const { itemId } = req.body;

    try {
        await ProductCategory.findOneAndUpdate({ _id: pcid }, { $pull: { listCategory: { _id: itemId } } }, { new: true });
        res.status(200).json({ success: true, message: 'delete category success' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'delete failue' });
    }
};

module.exports = {
    getProductCategory,
    createProductCategory,
    deleteProductCategory,
    createTitleItem,
    editTitle,
    editTitleItem,
    deleteProductCategoryItem,
};
