const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    month: String, // format: YYYY-MM
    consumption: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    breakdown: [{
        slab: String,
        rate: Number,
        unitsInSlab: Number,
        subtotal: Number
    }],
    status: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    billDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bill', billSchema);
