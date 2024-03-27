const express = require('express');
const router = express.Router();
const Bill = require('../Controller/Bill');
const { verifyAccessToken, isAdmin } = require('../Middleware/VerifyToken');

router.get('/', [verifyAccessToken], Bill.getBillsByUser);
router.get('/admin', [verifyAccessToken, isAdmin], Bill.getBillsByAdmin);
router.post('/', Bill.createBill);
router.put('/status/:bid', [verifyAccessToken], Bill.updateStatusBill);

module.exports = router;
