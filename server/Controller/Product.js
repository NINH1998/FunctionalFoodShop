const StoreSchema = require('../Model/Product');
const slugify = require('slugify');

const getProduct = async (req, res) => {
    const { pid } = req.params;

    try {
        const product = await StoreSchema.findById(pid).populate({
            path: 'ratings',
            populate: {
                path: 'postedBy',
                select: 'firstname lastname avatar',
            },
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

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchEl) => `$${matchEl}`);
    const formatQueries = JSON.parse(queryString);

    if (req.query.q) {
        delete formatQueries.q;
        formatQueries['$or'] = [{ title: { $regex: req.query.q, $options: 'i' } }];
    }

    let discount = {};
    if (req.query.select) {
        delete formatQueries.select;
        discount = { 'discount.percentage': { $gt: 0 } };
    }

    let categories = {};
    if (queries?.category) {
        // delete formatQueries.category;
        categories = { $or: queries?.category.split(',').map((el) => ({ category: { $regex: el, $options: 'i' } })) };
    }

    let mainCategories = {};
    if (queries?.mainCategory) {
        delete formatQueries.mainCategory;
        mainCategories = {
            $or: queries?.mainCategory.split(',').map((el) => ({ mainCategory: { $regex: el, $options: 'i' } })),
        };
    }
    let priceFilter = {};
    if (queries?.From && queries?.To) {
        delete formatQueries.From;
        delete formatQueries.To;
        priceFilter = { price: { $gte: queries?.From, $lte: queries?.To } };
    }

    const category = { ...categories, ...mainCategories, ...priceFilter, ...formatQueries, ...discount };

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
        const products = await queriesCommand;
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
            price: price * (1 - percentage / 100) || price,
            description,
            brand,
            category,
            mainCategory,
            thumb,
            images,
            discount: { expiryDiscount: Date.now() + expiry * 24 * 60 * 60 * 1000, percentage },
        });
        res.status(200).json({ success: true, message: 'Tạo sản phẩm thành công', createdProduct: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi, tạo sản phẩm thất bại' });
    }
};

const updateProduct = async (req, res) => {
    const { title, uses, price, description, brand, category, expiry, percentage, quantity, origin, unitCalculation } =
        req.body;
    const { pid } = req.params;
    const files = req?.files;
    if (files?.thumb) req.body.thumb = files?.thumb[0]?.path;
    if (files?.images) req.body.images = files?.images?.map((el) => el.path);
    try {
        const updatedProduct = {
            title,
            slug: slugify(req.body.title),
            uses,
            price: price * (1 - percentage / 100) || price,
            description,
            brand,
            category,
            unitCalculation,
            quantity,
            origin,
            thumb: req.body.thumb,
            images: req.body.images,
            discount: { expiryDiscount: Date.now() + expiry * 24 * 60 * 60 * 1000, percentage },
        };
        const updateProduct = await StoreSchema.findByIdAndUpdate(pid, updatedProduct, { new: true });
        res.status(200).json({ success: true, message: 'update success', updateProduct: updateProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Chỉnh sửa thất bại' });
    }
};

const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        await StoreSchema.deleteOne({ _id: pid });
        res.json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        console.log(error);
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
            //  update comment and star
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

        return res.json({ success: true, message: 'raings success', ratings: updateProduct });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'rating fail' });
    }
};

const uploadImgProduct = async (req, res) => {
    const { pid } = req.params;

    if (!req.files) return res.status(400).json({ success: false, message: 'Missing inputs' });
    try {
        const response = await StoreSchema.findByIdAndUpdate(
            pid,
            { $push: { images: { $each: req.files.map((el) => el.path) } } },
            { new: true },
        );
        return res.status(200).json({ success: true, message: '', images: response });
    } catch (error) {}
};

module.exports = {
    getProduct,
    fetchProducts,
    createProduct,
    updateProduct,
    ratingProduct,
    deleteProduct,
    uploadImgProduct,
};
