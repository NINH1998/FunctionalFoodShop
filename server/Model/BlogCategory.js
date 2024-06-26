const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryBlog = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('blogCategory', CategoryBlog);
