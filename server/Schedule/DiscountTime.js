const StoreSchema = require('../Model/Product');

async function updateProductPrices() {
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
}

async function updateIsNewProduct() {
    try {
        const currentDate = new Date();
        const sevenDaysAgo = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);

        await StoreSchema.updateMany({ createdAt: { $gt: sevenDaysAgo } }, { $set: { isNewProduct: true } });
        console.log('Updated isNewProduct for old products.');
    } catch (error) {
        console.error('Error updating isNewProduct:', error);
    }
}

const scheduleDailyTask = () => {
    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const timeUntilNextDay = nextDay - now;
    const exp = setTimeout(() => {
        updateProductPrices();
        updateIsNewProduct();
        scheduleDailyTask();
    }, timeUntilNextDay);
    return () => clearTimeout(exp);
};

// Bắt đầu lên lịch công việc

module.exports = scheduleDailyTask;
