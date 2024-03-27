const Brand = require('../Model/Brand');

const getBrands = async (req, res) => {
    try {
        const response = await Brand.find();
        return res.status(200).json({ success: true, message: 'get brand success', Brands: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'get failue' });
    }
};

const createBrand = async (req, res) => {
    try {
        const response = await Brand.create(req.body);
        res.status(200).json({ success: true, message: 'create brand success', createdBrand: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'create failue' });
    }
};

const updatedBrand = async (req, res) => {
    const { pcid } = req.params;
    try {
        const response = await Brand.findByIdAndUpdate(pcid, req.body, { new: true });
        res.status(200).json({ success: true, message: 'update brand success', updatedBrand: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'update failue' });
    }
};

const deleteBrand = async (req, res) => {
    const { pcid } = req.params;
    try {
        await Brand.findByIdAndDelete(pcid);
        res.status(200).json({ success: true, message: 'delete brand success' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'delete failue' });
    }
};

module.exports = { getBrands, createBrand, updatedBrand, deleteBrand };
