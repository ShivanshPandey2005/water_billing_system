const db = require('../config/mockDb');

exports.addUsage = async (req, res) => {
    try {
        const { flatId, reading } = req.body;
        const newUsage = { _id: 'm' + (db.usage.length + 1), flatId, reading, readingDate: new Date() };
        db.usage.push(newUsage);
        res.status(201).json({ success: true, data: newUsage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFlatUsage = async (req, res) => {
    const usage = db.usage.filter(u => u.flatId === req.params.flatId);
    res.status(200).json({ success: true, count: usage.length, data: usage });
};

exports.getAllUsage = async (req, res) => {
    res.status(200).json({ success: true, count: db.usage.length, data: db.usage });
};
