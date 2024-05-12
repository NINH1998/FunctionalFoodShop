const User = require('../Model/User');
const jwt = require('jsonwebtoken');
const schedule = require('node-schedule');
const crypto = require('crypto');
const { Accesstoken, Refreshtoken } = require('../Middleware/JWT');
const sendMail = require('../Middleware/sendMail');
const asyncHandler = require('express-async-handler');

const getUsers = async (req, res) => {
    const queries = { ...req.query };
    const excludeFiled = ['limit', 'sort', 'page', 'fileds'];
    excludeFiled.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchEl) => `$${matchEl}`);
    const formatQueries = JSON.parse(queryString);

    if (queries?.name) formatQueries.name = { $regex: queries.name, $options: 'i' };
    if (req.query.q) {
        delete formatQueries.q;
        formatQueries['$or'] = [
            { firstname: { $regex: req.query.q, $options: 'i' } },
            { lastname: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } },
        ];
    }
    let queriesCommand;
    queriesCommand = User.find(formatQueries);

    // sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queriesCommand = queriesCommand.sort(sortBy);
    }

    // Fileds
    if (req.query.fileds) {
        const filed = req.query.fileds.split(',').join(' ');
        queriesCommand = queriesCommand.select(filed);
    }

    // Limit & page
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_USER;
    const skip = (page - 1) * limit;
    queriesCommand.skip(skip).limit(limit);

    try {
        const response = await queriesCommand.select('-password -refreshToken');
        const counts = await User.find(formatQueries).countDocuments();
        return res.status(200).json({ success: true, message: 'Get users successfully', counts, users: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'server error' });
    }
};

const getUser = async (req, res) => {
    const { _id } = req.user;
    try {
        const user = await User.findById(_id)
            .select('-password -refreshToken')
            .populate({
                path: 'cart',
                populate: {
                    path: 'product',
                    select: 'title thumb price uses',
                },
            })
            .populate({
                path: 'wishlist',
                populate: {
                    path: 'product',
                    select: 'title price thumb',
                },
            });
        if (!user) return res.json(400).json({ success: false, message: 'User not found' });
        return res.status(200).json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'server error' });
    }
};

const updateUser = async (req, res) => {
    const { _id } = req.user;
    const { firstname, lastname, emailAddress, avatar, phone, address } = req.body;
    if (req?.file) req.body.avatar = req?.file?.path;
    if (!(_id || Object.keys(req.body).length === 0))
        return res.status(400).json({ success: false, message: 'Missing inputs' });
    try {
        const dataUpdateUser = { firstname, lastname, emailAddress, avatar: req.body.avatar, phone, address };
        const response = await User.findByIdAndUpdate(_id, dataUpdateUser, { new: true }).select(
            '-password -role -refreshToken',
        );
        return res.status(200).json({ success: true, message: 'Cập nhật thông tin thành công', updateUser: response });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi, Không cập nhập được thông tin' });
    }
};

const updateUserByAdmin = async (req, res) => {
    const { uid } = req.params;
    const { firstname, lastname, emailAddress, avatar, phone, address, role, isBlocked } = req.body;
    if (Object.keys(req.body).length === 0) return res.status(400).json({ success: false, message: 'Missing inputs' });
    try {
        const updateData = { firstname, lastname, emailAddress, avatar, phone, address, role, isBlocked };
        const updateUser = await User.findByIdAndUpdate(uid, updateData, { new: true }).select(
            '-password -role -refreshToken',
        );
        return res.status(200).json({ success: true, message: 'Cập nhật thông tin thành công', updateUser });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi, Không cập nhập được thông tin' });
    }
};

const deleteUser = async (req, res) => {
    const { uid } = req.params;
    try {
        if (!uid) return res.status(400).json({ success: false, message: 'User not found' });
        const response = await User.findByIdAndDelete(uid);
        return res.status(200).json({ success: true, message: `User: ${response.email} deleted successfully` });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'server error' });
    }
};

const register = async (req, res) => {
    const { firstname, lastname, email, password, phone } = req.body;

    if (!email || !password || !lastname || !firstname || !phone) {
        return res.status(400).json({ success: false, message: 'Missing input' });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'Người dùng đã tồn tại' });

    const phoneNumber = await User.findOne({ phone });
    if (phoneNumber) return res.status(400).json({ success: false, message: 'Số điện thoại trùng' });

    try {
        const otp = Math.floor(1000 + Math.random() * 9000);
        const otpExpiration = new Date();
        otpExpiration.setSeconds(otpExpiration.getSeconds() + 60);
        const user = new User({ email, password, lastname, firstname, phone, otp, otpExpiration });
        await user.save();
        const html = `<p>Otp sẽ hết hạn sau 1 phút</p><br/><h2>Register code:</h2><br/><h1 style="color:orange">${otp}</h1>`;
        await sendMail({ email, html, subject: 'Hoàn tất đăng kí' });

        schedule.scheduleJob(otpExpiration, async () => {
            await User.deleteOne({ email, otp, otpExpiration });
            console.log('Tài khoản chưa được xác nhận OTP đã bị xóa');
        });

        return res.status(200).json({ success: true, message: 'Kiểm tra email của bạn' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'bruh' });
    }
};

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp, otpExpiration: { $gt: new Date() } });
        if (!user) return res.status(400).json({ success: false, message: 'OTP hết hạn' });

        const job = schedule.scheduledJobs[user.otpExpiration.toString()];
        if (job) job.cancel();
        user.otp = null;
        user.otpExpiration = null;
        await user.save();
        res.json({ success: true, message: 'Đăng kí thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Xảy ra lỗi' });
    }
});

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing email or password' });
    try {
        const user = await User.findOne({ email });
        if (user.isBlocked) {
            return res.status(500).json({ success: false, message: 'Tài khoản đã bị khóa do vi phạm điều khoản' });
        }
        if (user && (await user.isCorrectPassword(password))) {
            const { password, role, refreshToken, ...userdata } = user.toObject();
            const accessToken = Accesstoken(user._id, role);
            const newRefreshToken = Refreshtoken(user._id);
            await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken }, { new: true });
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
            return res.json({ success: true, message: 'login success', accessToken, userdata: { ...userdata, role } });
        }
        return res.status(500).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Account login failed' });
    }
};

const refreshAccessToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(400).json({ success: false, message: 'No refreshToken in cookie' });
    try {
        const decode = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const response = await User.findOne({ _id: decode._id, refreshToken: token });
        return res
            .status(200)
            .json({ success: true, message: 'Okay', newAccessToken: Accesstoken(response._id, response.role) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid refresh token' });
    }
};

const logout = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie) return res.status(400).json({ success: false, message: 'No refreshToken in cookie' });
    try {
        await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.status(200).json({ success: true, message: 'logout successs' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Can not Logout' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email, googleId: { $exists: false } });
    if (!user) return res.status(400).json({ success: false, message: 'Tài khoản không tồn tại' });
    try {
        const resetToken = user.createPasswordChangeToken();
        await user.save();
        const html = `Xin vui lòng click vào link bên dưới để thay đổi mật khẩu. Link này sẽ hết hạn sau 15 phút kể từ bây giờ.
        <a href=${process.env.URL_CLIENT}/resetpassword/${resetToken}>Click here</a>`;
        const data = {
            email,
            html,
            subject: 'Quên mật khẩu',
        };
        await sendMail(data);
        return res.status(200).json({ success: true, message: 'Gửi thành công, hãy kiểm tra email' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Gửi thất bại' });
    }
};

const resetPassword = async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) return res.status(400).json({ success: false, message: 'Missing inputs' });
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: 'Hết hạn đổi mật khẩu' });
    try {
        user.password = password;
        user.passwordChangeAt = Date.now();
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return res.status(200).json({ success: true, message: 'Tạo lại mật khẩu thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Can not reset password' });
    }
};

const uploadUserAddress = async (req, res) => {
    const { _id } = req.user;

    if (!req.body.address) return res.status(400).json({ success: false, message: 'Missing inputs' });
    try {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { address: req.body.address } },
            { new: true },
        ).select(' -password -role -refreshToken');
        return res.status(200).json({ success: true, message: 'update address success', address: response });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Can not update' });
    }
};

const updateCart = async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity } = req.body;

    if (!pid) return res.status(400).json({ success: false, message: 'Missing inputs' });
    try {
        const user = await User.findById(_id).select('cart');
        const alreadyProduct = user?.cart?.find((el) => el.product.toString() === pid);

        if (alreadyProduct) {
            const response = await User.updateOne(
                { cart: { $elemMatch: alreadyProduct } },
                { $set: { 'cart.$.quantity': quantity } },
            );
            return res.status(200).json({ success: true, message: 'Thêm thành công vào giỏ hàng', cartUser: response });
        }
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { cart: { product: pid, quantity } } },
            { new: true },
        );
        return res.status(200).json({ success: true, message: 'Thêm thành công vào giỏ hàng', cartUser: response });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Thêm vào giỏ thất bại' });
    }
};

const deleteProduct = async (req, res) => {
    const { _id } = req.user;
    const { pid } = req.params;
    try {
        const user = await User.findById(_id)
            .select('cart')
            .populate({
                path: 'cart',
                populate: {
                    path: 'product',
                    select: 'title thumb price uses',
                },
            });
        const alreadyProduct = user?.cart?.find((el) => el.product._id.toString() === pid);

        if (!alreadyProduct) {
            return res.status(200).json({ success: true, message: 'upload cart success' });
        }
        await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid } } }, { new: true });
        return res.status(200).json({ success: true, message: 'Xóa thành công' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Không thể xóa' });
    }
};

const deleteAllCart = async (req, res) => {
    const { userId } = req.body;
    if (userId) {
        try {
            await User.findByIdAndUpdate(userId, { $set: { cart: [] } }, { new: true });
            return res.status(200).json({ success: true, message: 'Xóa thành công' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Không thể xóa' });
        }
    } else return;
};

const wishlistUser = async (req, res) => {
    const { _id } = req.user;
    const { pid } = req.params;

    try {
        const user = await User.findById(_id);
        const alreadyWishlist = user?.wishlist?.find((el) => el.product?._id.toString() === pid);
        if (alreadyWishlist) {
            await User.findByIdAndUpdate(_id, { $pull: { wishlist: { product: pid } } }, { new: true });
            return res.status(200).json({ success: true, message: 'Đã bỏ yêu thích' });
        } else {
            await User.findByIdAndUpdate(_id, { $push: { wishlist: { product: pid } } }, { new: true });
            return res.status(200).json({ success: true, message: 'Đã thêm vào yêu thích' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi không xác định' });
    }
};

module.exports = {
    getUser,
    getUsers,
    updateUser,
    updateUserByAdmin,
    deleteUser,
    register,
    login,
    refreshAccessToken,
    logout,
    uploadUserAddress,
    updateCart,
    forgotPassword,
    resetPassword,
    deleteProduct,
    deleteAllCart,
    wishlistUser,
    verifyOTP,
};
