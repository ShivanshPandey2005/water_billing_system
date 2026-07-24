const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
    flatNumber: {
        type: String,
        required: [true, 'Please enter a flat number'],
        unique: true
    },
    floor: Number,
    ownerName: String,
    ownerPhone: String,
    residents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Flat', flatSchema);
