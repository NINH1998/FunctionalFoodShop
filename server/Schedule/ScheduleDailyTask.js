const StoreSchema = require('../Model/Product');
const ProductTag = require('../Model/ProductTag');
const Tag = require('../Model/Tag');

// Lịch trình 1 ngày......................................

const updateProductPrices = async () => {
    try {
        const productsToUpdate = await StoreSchema.find({ 'discount.expiryDiscount': { $lte: new Date() } });

        for (const product of productsToUpdate) {
            const cost = product.price / (1 - product.discount.percentage / 100);
            product.price = cost;
            product.discount = undefined;
            await product.save();
        }
        console.log('Đã cập nhật giá của các sản phẩm.');
    } catch (error) {
        console.error('Lỗi khi cập nhật giá:', error);
    }
};

const updateIsNewProduct = async () => {
    try {
        const currentDate = new Date();
        const sevenDaysAgo = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);

        await StoreSchema.updateMany({ createdAt: { $gt: sevenDaysAgo } }, { $set: { isNewProduct: true } });
        console.log('Updated isNewProduct for old products.');
    } catch (error) {
        console.error('Error updating isNewProduct:', error);
    }
};

const scheduleDailyTask = () => {
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const timeUntilNextDay = nextDay - now;
    const expire = setTimeout(() => {
        updateProductPrices();
        updateIsNewProduct();
        scheduleDailyTask();
    }, timeUntilNextDay);
    return () => clearTimeout(expire);
};

// Lịch trình 1 tuần......................................

const updateBestSellerTag = async () => {
    try {
        const productsToUpdate = await StoreSchema.find({ sold: { $gte: 10 } });
        const tagName = await Tag.findOne({ title: { $regex: /Bán chạy/i } });

        console.log(productsToUpdate);
        if (productsToUpdate && tagName) {
            for (const product of productsToUpdate) {
                await ProductTag.create({
                    productId: product._id,
                    tagId: tagName._id,
                });
            }
        }
        console.log('Đã cập nhật tag');
    } catch (error) {
        console.error('Lỗi khi cập nhật tag:', error);
    }
};

const scheduleWeekTask = () => {
    const now = new Date();
    const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 0, 0, 0);
    const timeUntilNextWeek = nextWeek - now;
    const expire = setTimeout(() => {
        updateBestSellerTag();
    }, timeUntilNextWeek);
    return () => clearTimeout(expire);
};

module.exports = { scheduleWeekTask, scheduleDailyTask };
