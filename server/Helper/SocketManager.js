const BillSchema = require('../Model/Bill');

const notifyAdminAboutNewBill = async (socket) => {
    socket.on('getUnreadOrderCount', async () => {
        const unreadOrders = await BillSchema.countDocuments({ viewed: false });
        socket.emit('unreadOrderCount', unreadOrders);
    });

    socket.on('markBillAsRead', async () => {
        await BillSchema.updateMany({ viewed: true });
    });
};

module.exports = { notifyAdminAboutNewBill };
