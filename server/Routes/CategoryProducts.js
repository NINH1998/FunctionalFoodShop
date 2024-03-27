const express = require('express');
const router = express.Router();
const Product = require('../Controller/CategoryProducts');
const { verifyAccessToken, isAdmin } = require('../Middleware/VerifyToken');

// POST Product information

router.get('/', Product.getProductCategory);
router.post('/', [verifyAccessToken, isAdmin], Product.createProductCategory);
router.put('/:pcid', [verifyAccessToken, isAdmin], Product.createTitleItem);
router.put('/edit-title/:pcid', [verifyAccessToken, isAdmin], Product.editTitle);
router.put('/edit-item/:pcid', [verifyAccessToken, isAdmin], Product.editTitleItem);
router.put('/:pcid', [verifyAccessToken, isAdmin], Product.createTitleItem);
router.delete('/:pcid', [verifyAccessToken, isAdmin], Product.deleteProductCategory);
router.delete('/removeItem/:pcid/', [verifyAccessToken, isAdmin], Product.deleteProductCategoryItem);

module.exports = router;
