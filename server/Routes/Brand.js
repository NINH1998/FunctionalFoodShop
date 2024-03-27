const express = require('express');
const router = express.Router();
const Brand = require('../Controller/Brand');
const { verifyAccessToken, isAdmin } = require('../Middleware/VerifyToken');

// POST Blog information

router.get('/', Brand.getBrands);
router.post('/', [verifyAccessToken, isAdmin], Brand.createBrand);
router.put('/:pcid', [verifyAccessToken, isAdmin], Brand.updatedBrand);
router.delete('/:pcid', [verifyAccessToken, isAdmin], Brand.deleteBrand);

module.exports = router;
