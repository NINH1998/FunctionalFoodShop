const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tag = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        colorTag: {
            type: String,
        },
        iconTag: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('tag', Tag);
