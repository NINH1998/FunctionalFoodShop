const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productTag = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'tag' },
});

module.exports = mongoose.model('productTag', productTag);
