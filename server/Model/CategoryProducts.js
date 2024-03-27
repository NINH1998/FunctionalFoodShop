const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryProducts = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        listCategory: [
            {
                itemTitle: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('CategoryProduct', CategoryProducts);
