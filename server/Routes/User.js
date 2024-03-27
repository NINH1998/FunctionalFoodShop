const express = require('express');
const router = express.Router();
const User = require('../Controller/User');
const { verifyAccessToken, isAdmin } = require('../Middleware/VerifyToken');
const upload = require('../Config/Cloudinary.config');

router.get('/logout', User.logout);
router.get('/current', verifyAccessToken, User.getUser);
router.get('/', [verifyAccessToken, isAdmin], User.getUsers);

router.post('/register', User.register);
router.post('/login', User.login);
router.post('/forgotpassword', User.forgotPassword);
router.post('/refreshtoken', User.refreshAccessToken);

router.put('/verify-otp', User.verifyOTP);
router.put('/resetpassword', User.resetPassword);
router.put('/remove-all-cart', User.deleteAllCart);
router.put('/address', verifyAccessToken, User.uploadUserAddress);
router.put('/cart', verifyAccessToken, User.updateCart);
router.put('/current', verifyAccessToken, upload.single('avatar'), User.updateUser);
router.put('/remove-cart/:pid', verifyAccessToken, User.deleteProduct);
router.put('/wishlist/:pid', verifyAccessToken, User.wishlistUser);
router.put('/:uid', [verifyAccessToken, isAdmin], User.updateUserByAdmin);

router.delete('/:uid', [verifyAccessToken, isAdmin], User.deleteUser);

module.exports = router;
