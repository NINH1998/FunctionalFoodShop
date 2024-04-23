const StoreSchema = require('../Model/Product');
const categoryProducts = require('../Model/CategoryProducts');
const slugify = require('slugify');
const scraperData = require('../ScraperData/ProductDetailData.json');

const createProduct = async (product) =>
    new Promise(async (resolve, reject) => {
        const categories = await categoryProducts.findOne({
            title: { $regex: product?.categoryProduct?.mainCategory, $options: 'i' },
        });

        try {
            await StoreSchema.create({
                thumb: product?.thumb,
                images: product?.images,
                title: product?.productSpecifications?.title,
                slug: slugify(product?.productSpecifications?.title),
                price: product?.productSpecifications?.price,
                discount: { percentage: product?.discount?.percentage },
                uses: product?.productSpecifications?.uses,
                description: product?.descriptionProduct?.description,
                mainCategory: [categories._id],
                category: product?.categoryProduct?.category,
            });
            resolve();
        } catch (error) {
            reject(error);
            // console.error('Lỗi:', error);
        }
    });

const insertProduct = async (req, res) => {
    const promises = [];
    for (let product of scraperData) promises.push(createProduct(product));
    await Promise.all(promises);
    return res.status(200).json({ message: 'Done!' });
};

const editPRoduct = async (req, res) => {
    try {
        const products = await StoreSchema.find({
            $or: [
                { category: { $regex: 'Collagen', $options: 'i' } },
                { category: { $regex: 'Hoa anh thảo', $options: 'i' } },
                { category: { $regex: 'Omega3', $options: 'i' } },
                { category: { $regex: 'Tăng cân, giảm cân', $options: 'i' } },
                { category: { $regex: 'Viên uống đẹp da', $options: 'i' } },
                { category: { $regex: 'Vitamin', $options: 'i' } },
            ],
        });

        for (const product of products) {
            const category = await categoryProducts.findOne({
                'listCategory.itemTitle': { $regex: product.category, $options: 'i' },
            });
            if (category) {
                product.mainCategory.push(category._id);
                await product.save();
            }
        }
        return res.status(200).json({ message: 'Done!' });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { insertProduct, editPRoduct };
