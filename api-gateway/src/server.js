require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

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

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// API status for health check
app.get('/api/status', (req, res) => {
    res.json({ status: 'Mock API Gateway is running' });
});

// Fallback to index.html for Angular routing (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
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
