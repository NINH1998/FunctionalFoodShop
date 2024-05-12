const Bill = require('../Model/Bill');
const StoreSchema = require('../Model/Product');
const { orderQueue } = require('../Schedule/Queue');
const socket = require('../Helper/SocketManager');

const getBillsByUser = async (req, res) => {
    const { _id } = req.user;
    const queries = { ...req.query };
    //  Tách trường đặc biệt ra khỏi query
    const excludeFiled = ['limit', 'sort', 'page', 'fileds'];
    excludeFiled.forEach((el) => delete queries[el]);

    // format cho match với mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchEl) => `$${matchEl}`);
    const formatQueries = JSON.parse(queryString);
    //  filter

    let queriesCommand;
    queriesCommand = Bill.find({ ...formatQueries, orderBy: _id });

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
    const limit = +req.query.limit || +process.env.LIMIT_HISTORY_BILL;
    const skip = (page - 1) * limit;
    queriesCommand.skip(skip).limit(limit);

    try {
        const response = await queriesCommand.select('-password -refreshToken');
        const counts = await Bill.find({ ...formatQueries, orderBy: _id }).countDocuments();
        return res.status(200).json({ success: true, message: 'Get users successfully', counts, bill: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'server error' });
    }
};

const getBillsByAdmin = async (req, res) => {
    const queries = { ...req.query };
    const excludeFiled = ['limit', 'sort', 'page', 'fileds'];
    excludeFiled.forEach((el) => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchEl) => `$${matchEl}`);
    const formatQueries = JSON.parse(queryString);

    let queriesCommand;
    queriesCommand = Bill.find(formatQueries);

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
    const limit = +req.query.limit || +process.env.LIMIT_HISTORY_BILL;
    const skip = (page - 1) * limit;
    queriesCommand.skip(skip).limit(limit);

    try {
        const response = await queriesCommand.populate({
            path: 'orderBy',
            select: 'firstname lastname address avatar',
        });
        const counts = await Bill.find(formatQueries).countDocuments();
        return res.status(200).json({ success: true, message: 'Get users successfully', counts, bills: response });
    } catch (error) {
        res.status(500).json({ success: false, message: 'server error' });
    }
};

const createBill = async (req, res) => {
    const { products, total, payments, name, phone, emailAddress, subName, subPhone, address, _id } = req.body;
    if (!(products && total && payments && subName && subPhone && name && phone && emailAddress))
        return res.status(400).json({ success: false, message: 'Thiếu thông tin' });

    try {
        await orderQueue.add(
            { products, total, _id, payments, name, phone, emailAddress, subName, subPhone, address },
            { delay: 1000 },
        );

        let unreadOrders = await Bill.countDocuments({ viewed: false });
        req.app.get('socketIo').emit('unreadOrderCount', unreadOrders + 1);
        return res.status(200).json({ success: true, message: 'Thanh toán thành công' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Thanh toán thất bại' });
    }
};

const updateStatusBill = async (req, res) => {
    const { bid } = req.params;
    const { status } = req.body;
    if (!status) res.status(400).json({ success: false, message: 'missing status' });
    try {
        const response = await Bill.findByIdAndUpdate(bid, { status }, { new: true });
        return res.status(200).json({ success: true, message: 'update status success', statusBill: response });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'update status failure ' });
    }
};
module.exports = { getBillsByAdmin, getBillsByUser, createBill, updateStatusBill };
