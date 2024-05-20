const express = require('express');
const router = express.Router();
const Product = require('../Controller/Product');
const { verifyAccessToken, isAdmin } = require('../Middleware/VerifyToken');
const upload = require('../Config/Cloudinary.config');

router.get('/', Product.fetchProducts);
router.get('/:pid', Product.getProduct);

router.post(
    '/',
    [verifyAccessToken, isAdmin],
    upload.fields([
        {
            name: 'images',
            maxCount: 10,
        },
        {
            name: 'thumb',
            maxCount: 1,
        },
    ]),
    Product.createProduct,
);

router.put('/ratings', verifyAccessToken, Product.ratingProduct);
router.put(
    '/:pid',
    verifyAccessToken,
    isAdmin,
    upload.fields([
        {
            name: 'images',
            maxCount: 10,
        },
        {
            name: 'thumb',
            maxCount: 1,
        },
    ]),
    Product.updateProduct,
);

router.delete('/:pid', [verifyAccessToken, isAdmin], Product.deleteProduct);

module.exports = router;
