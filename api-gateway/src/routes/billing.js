const express = require('express');
const router = express.Router();
const { calculateBill, getFlatBills, payBill } = require('../controllers/billingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/calculate', authorize('admin'), calculateBill);
router.get('/flat/:flatId', getFlatBills);
router.put('/:billId/pay', payBill);

module.exports = router;
