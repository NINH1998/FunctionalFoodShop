const Coupon = require('../Model/Coupon');

const getCoupons = async (req, res) => {
    try {
        const response = await Coupon.find();
        return res.status(200).json({ success: true, message: 'get Coupon success', Coupons: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'get Coupon failue' });
    }
};

const createCoupon = async (req, res) => {
    const { name, discount, expiry } = req.body;

    if (!name || !discount || !expiry) return res.json({ success: false, message: 'missing input' });
    try {
        const response = await Coupon.create({ ...req.body, expiry: Date.now() + expiry * 24 * 60 * 60 * 1000 });
        res.status(200).json({ success: true, message: 'create Coupon success', createdCoupon: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'create Coupon failue' });
    }
};

const updateCoupon = async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(req.body).length === 0) return res.status(400).json({ success: false, message: 'Missing inputs' });
    try {
        const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
        res.status(200).json({ success: true, message: 'update Coupon success', updatedCoupon: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'update Coupon failue' });
    }
};

const deleteCoupon = async (req, res) => {
    const { cid } = req.params;
    try {
        await Coupon.findByIdAndDelete(cid);
        res.status(200).json({ success: true, message: 'delete Coupon success' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'delete Coupon   failue' });
    }
};

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon };
