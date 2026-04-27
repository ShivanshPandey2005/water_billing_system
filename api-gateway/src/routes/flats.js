const express = require('express');
const router = express.Router();
const { getFlats, getFlat, createFlat, updateFlat, addResident } = require('../controllers/flatController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getFlats)
    .post(authorize('admin'), createFlat);

router.route('/:id')
    .get(getFlat)
    .put(authorize('admin'), updateFlat);

router.post('/:id/residents', authorize('admin'), addResident);

module.exports = router;
