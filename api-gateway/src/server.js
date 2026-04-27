require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Mock Mode for Demo - Bypasses MongoDB
console.log('--- Running in MOCK DEMO MODE (In-Memory DB) ---');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/flats', require('./routes/flats'));
app.use('/api/usage', require('./routes/usage'));
app.use('/api/billing', require('./routes/billing'));

// Root path for health check
app.get('/', (req, res) => {
    res.json({ status: 'Mock API Gateway is running' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server Error'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`MOCK API Gateway running on port ${PORT}`);
    console.log('Demo Credentials:');
    console.log(' - Admin: admin@example.com / password');
    console.log(' - Resident: john@example.com / password');
});
