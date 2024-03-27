const mongoose = require('mongoose'); // Erase if already required

var brandSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('brand', brandSchema);
