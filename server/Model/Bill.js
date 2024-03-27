const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var billSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    thumb: String,
                    title: String,
                    price: Number,
                },
                quantity: Number,
            },
        ],
        buyer: {
            name: String,
            phone: Number,
        },
        receiver: {
            subName: String,
            subPhone: Number,
        },
        emailAddress: String,
        address: String,
        payments: String,
        addressDelivery: String,
        total: Number,
        status: {
            type: String,
            default: 'processing',
            enum: ['processing', 'cancelled', 'successed'],
        },
        coupon: {
            type: mongoose.Types.ObjectId,
            ref: 'coupon',
        },
        orderBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
);

//Export the model
module.exports = mongoose.model('bill', billSchema);
