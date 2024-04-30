const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../Model/User');

const StoreSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        thumb: {
            type: String,
            // required: true,
        },
        images: {
            type: Array,
        },
        description: {
            type: String,
            required: true,
        },
        uses: {
            type: String,
        },
        brand: {
            type: String,
        },
        origin: {
            type: String,
        },
        unitCalculation: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        discountedPrice: {
            type: Number,
            default: 0,
        },
        discount: {
            percentage: {
                type: Number,
                default: 0,
            },
            expiryDiscount: {
                type: Date,
                default: Date.now(),
            },
        },
        sold: {
            type: Number,
            default: 0,
        },
        mainCategory: [{ type: mongoose.Types.ObjectId, ref: 'CategoryProduct' }],
        category: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        ratings: [
            {
                star: { type: Number },
                postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
                comment: { type: String },
                commentAt: { type: Date },
            },
        ],
        totalRatings: {
            type: Number,
            default: 0,
        },
        isNewProduct: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

StoreSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const productId = this.getFilter()._id;
    await User.updateMany({ 'wishlist.product': productId }, { $pull: { wishlist: { product: productId } } });
    next();
});

module.exports = mongoose.model('product', StoreSchema);
