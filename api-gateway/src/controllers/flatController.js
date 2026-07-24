const db = require('../config/mockDb');

exports.getFlats = async (req, res) => {
    res.status(200).json({ success: true, count: db.flats.length, data: db.flats });
};

exports.getFlat = async (req, res) => {
    const flat = db.flats.find(f => f._id === req.params.id);
    if (!flat) return res.status(404).json({ success: false, message: 'Flat not found' });
    res.status(200).json({ success: true, data: flat });
};

exports.createFlat = async (req, res) => {
    const { flatNumber, floor, ownerName } = req.body;
    const newFlat = { _id: 'f' + (db.flats.length + 1), flatNumber, floor, ownerName, residents: [] };
    db.flats.push(newFlat);
    res.status(201).json({ success: true, data: newFlat });
};

exports.updateFlat = async (req, res) => {
    const flat = db.flats.find(f => f._id === req.params.id);
    if (!flat) return res.status(404).json({ success: false, message: 'Flat not found' });
    Object.assign(flat, req.body);
    res.status(200).json({ success: true, data: flat });
};

exports.addResident = async (req, res) => {
    const flat = db.flats.find(f => f._id === req.params.id);
    if (!flat) return res.status(404).json({ success: false, message: 'Flat not found' });
    const { userId } = req.body;
    if (!flat.residents.includes(userId)) flat.residents.push(userId);
    res.status(200).json({ success: true, data: flat });
};
