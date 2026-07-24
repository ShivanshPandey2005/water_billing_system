const express = require('express');
const router = express.Router();
const { addUsage, getFlatUsage, getAllUsage } = require('../controllers/usageController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(authorize('admin'), getAllUsage)
    .post(authorize('admin'), addUsage); // Admin or IoT sim

router.get('/:flatId', getFlatUsage);

module.exports = router;
