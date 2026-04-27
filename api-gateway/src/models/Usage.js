const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        required: true
    },
    reading: {
        type: Number,
        required: [true, 'Please provide the meter reading in kL']
    },
    readingDate: {
        type: Date,
        default: Date.now
    },
    unit: {
        type: String,
        default: 'kL' // kiloLitres
    }
});

module.exports = mongoose.model('Usage', usageSchema);
