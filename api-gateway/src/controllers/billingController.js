const db = require('../config/mockDb');

// @desc    Calculate bill for a flat (Demo Logic - Bypasses missing Spring Boot)
exports.calculateBill = async (req, res) => {
    try {
        const { flatId, month } = req.body;
        const flat = db.flats.find(f => f._id === flatId);
        if (!flat) return res.status(404).json({ success: false, message: 'Flat not found' });

        const usageData = db.usage.filter(u => u.flatId === flatId);
        const units = usageData.reduce((acc, curr) => acc + curr.reading, 0);

        // --- Mock Billing Logic (Direct port of Spring Boot logic) ---
        let remainingUnits = units;
        let totalAmount = 0;
        const breakdown = [];

        // Slab 1: 0-10 units @ 5.0
        const s1 = Math.min(remainingUnits, 10);
        if (s1 > 0) {
            const sub = s1 * 5;
            totalAmount += sub;
            breakdown.push({ slab: "0-10 units", rate: 5, unitsInSlab: s1, subtotal: sub });
            remainingUnits -= s1;
        }
        // Slab 2: 11-20 units @ 10.0
        const s2 = Math.min(remainingUnits, 10);
        if (s2 > 0) {
            const sub = s2 * 10;
            totalAmount += sub;
            breakdown.push({ slab: "11-20 units", rate: 10, unitsInSlab: s2, subtotal: sub });
            remainingUnits -= s2;
        }
        // Slab 3: 20+ units @ 20.0 (Simplified)
        if (remainingUnits > 0) {
            const sub = remainingUnits * 20;
            totalAmount += sub;
            breakdown.push({ slab: "20+ units", rate: 20, unitsInSlab: remainingUnits, subtotal: sub });
        }

        const newBill = {
            _id: 'b' + (db.bills.length + 1),
            flatId,
            month,
            consumption: units,
            totalAmount,
            breakdown,
            status: 'unpaid',
            billDate: new Date()
        };

        db.bills.push(newBill);
        res.status(201).json({ success: true, data: newBill });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getFlatBills = async (req, res) => {
    const bills = db.bills.filter(b => b.flatId === req.params.flatId);
    res.status(200).json({ success: true, count: bills.length, data: bills });
};

exports.payBill = async (req, res) => {
    const bill = db.bills.find(b => b._id === req.params.billId);
    if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
    bill.status = 'paid';
    res.status(200).json({ success: true, data: bill });
};
