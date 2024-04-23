const StoreSchema = require('../Model/Product');
const ProductTag = require('../Model/ProductTag');
const slugify = require('slugify');

const getProduct = async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await StoreSchema.findById(pid)
            .populate({
                path: 'ratings',
                populate: {
                    path: 'postedBy',
                    select: 'firstname lastname avatar',
                },
            })
            .populate({
                path: 'mainCategory',
                select: 'title listCategory',
            });
        res.status(200).json({ success: true, message: 'Get product success', product: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Can not create product' });
    }
};

const fetchProducts = async (req, res) => {
    const queries = { ...req.query };
    const excludeFiled = ['limit', 'sort', 'page', 'fileds'];
    excludeFiled.forEach((el) => delete queries[el]);

    let searchResult = {};
    if (req.query.q) {
        searchResult = { title: { $regex: req.query.q, $options: 'i' } };
    }

    let discount = {};
    if (req.query.select) {
        discount = { 'discount.percentage': { $gt: 0 } };
    }

    let categories = {};
    if (queries?.category) {
        categories = {
            $or: queries?.category.split(',').map((el) => ({ category: { $regex: el, $options: 'i' } })),
        };
    }

    let mainCategories = {};
    if (queries?.mainCategory) {
        if (Array.isArray(queries?.mainCategory)) {
            mainCategories = {
                $or: queries?.mainCategory.map((el) => ({ mainCategory: { $in: [el] } })),
            };
        } else {
            mainCategories = {
                $or: queries?.mainCategory?.split(',').map((el) => ({ mainCategory: { $in: [el] } })),
            };
        }
    }

    let priceFilter = {};
    if (queries?.From && queries?.To) {
        priceFilter = { price: { $gte: queries?.From, $lte: queries?.To } };
    }

    let filterByTagId = {};
    if (req.query.tagId) {
        const productTags = await ProductTag.find({ tagId: req.query.tagId });
        const productIds = productTags.map((productTag) => productTag.productId);
        filterByTagId = { _id: { $in: productIds } };
    }

    let combinedConditions = [];
    if (categories.$or) {
        combinedConditions = [...combinedConditions, ...categories.$or];
    }
    if (mainCategories.$or) {
        combinedConditions = [...combinedConditions, ...mainCategories.$or];
    }

    let finalQuery = {};
    if (combinedConditions.length > 0) {
        finalQuery = {
            $or: combinedConditions,
        };
    }

    const category = {
        ...finalQuery,
        ...priceFilter,
        ...discount,
        ...searchResult,
        ...filterByTagId,
    };

    let queriesCommand;
    queriesCommand = StoreSchema.find(category);

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
        const products = await queriesCommand.populate({
            path: 'mainCategory',
            select: 'title listCategory',
        });
        const counts = await StoreSchema.find(category).countDocuments();
        res.json({ success: true, counts, products: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Can not get product' });
    }
};

const createProduct = async (req, res) => {
    const { title, uses, price, description, brand, category, mainCategory, expiry, percentage } = req.body;
    const thumb = req?.files?.thumb[0]?.path;
    const images = req?.files?.images?.map((el) => el.path);
    if (!(title && price && uses && description && brand && category && mainCategory))
        return res.status(400).json({ success: false, message: 'Missing inputs' });
    try {
        if (thumb) req.body.thumb = thumb;
        if (images) req.body.images = images;
        const newProduct = await StoreSchema.create({
            title,
            slug: slugify(req.body.title),
            uses,
            price,
            description,
            brand,
            category,
            mainCategory: [mainCategory],
            thumb,
            images,
            discount: { expiryDiscount: Date.now() + expiry * 24 * 60 * 60 * 1000, percentage },
        });
        res.status(200).json({ success: true, message: 'Tạo sản phẩm thành công', createdProduct: newProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Lỗi, tạo sản phẩm thất bại' });
    }
};

const updateProduct = async (req, res) => {
    const {
        title,
        uses,
        price,
        description,
        brand,
        origin,
        unitCalculation,
        mainCategory,
        category,
        expiry,
        percentage,
        quantity,
    } = req.body;
    const { pid } = req.params;
    const files = req?.files;
    if (files?.thumb) req.body.thumb = files?.thumb[0]?.path;
    if (files?.images) req.body.images = files?.images?.map((el) => el.path);
    try {
        const updatedProduct = {
            title,
            slug: slugify(req.body.title),
            uses,
            price,
            description,
            brand,
            category,
            mainCategory: [mainCategory],
            unitCalculation,
            quantity,
            origin,
            thumb: req.body.thumb,
            images: req.body.images,
            discount: { expiryDiscount: Date.now() + expiry * 24 * 60 * 60 * 1000, percentage },
        };
        const updateProduct = await StoreSchema.findByIdAndUpdate(pid, updatedProduct, { new: true });
        res.status(200).json({ success: true, message: 'Chỉnh sửa thành công', updateProduct: updateProduct });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Chỉnh sửa thất bại' });
    }
};

const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        await StoreSchema.deleteOne({ _id: pid });
        res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Xóa thất bại' });
    }
};

const ratingProduct = async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid, commentAt } = req.body;
    if (!star || !pid || !comment) return res.status(400).json({ success: false, message: 'Bạn chưa nhập đánh giá' });
    try {
        const ratingProduct = await StoreSchema.findById(pid);
        const alreadyRating = ratingProduct?.ratings?.find((el) => el.postedBy.toString() === _id);
        if (alreadyRating) {
            await StoreSchema.updateOne(
                {
                    ratings: { $elemMatch: alreadyRating },
                },
                {
                    $set: { 'ratings.$.star': star, 'ratings.$.comment': comment, 'ratings.$.commentAt': commentAt },
                },
                { new: true },
            );
        } else {
            await StoreSchema.findByIdAndUpdate(
                pid,
                {
                    $push: { ratings: { star, comment, postedBy: _id, commentAt } },
                },
                { new: true },
            );
        }

        // rating calc
        const updateProduct = await StoreSchema.findById(pid);
        const ratingCount = updateProduct.ratings.length;
        const totalStarPoint = updateProduct.ratings.reduce((sum, el) => sum + +el.star, 0);
        const averageStar = totalStarPoint / ratingCount;
        updateProduct.totalRatings = averageStar.toFixed(1);
        await updateProduct.save();

        return res.json({ success: true, message: 'Đánh giá thành công', ratings: updateProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Có lỗi' });
    }
};

module.exports = {
    getProduct,
    fetchProducts,
    createProduct,
    updateProduct,
    ratingProduct,
    deleteProduct,
};
