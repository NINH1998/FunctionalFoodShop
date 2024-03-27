const express = require('express');
const router = express.Router();
const Coupon = require('../Controller/Coupon');
const { verifyAccessToken, isAdmin } = require('../Middleware/VerifyToken');

router.get('/', Coupon.getCoupons);
router.post('/', [verifyAccessToken, isAdmin], Coupon.createCoupon);
router.put('/:cid', [verifyAccessToken, isAdmin], Coupon.updateCoupon);
router.delete('/:cid', [verifyAccessToken, isAdmin], Coupon.deleteCoupon);

module.exports = router;
