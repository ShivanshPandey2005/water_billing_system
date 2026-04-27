// Simple In-Memory Database for Mock Demo
class MockDB {
    constructor() {
        this.users = [];
        this.flats = [];
        this.usage = [];
        this.bills = [];
        
        // Seed some data
        this.seed();
    }

    seed() {
        // Admin
        this.users.push({
            _id: 'u1',
            name: 'Society Admin',
            email: 'admin@example.com',
            password: '$2a$10$89.G3D..Tz4/GvK.r6fX/u7q6zYyO..T7zY/u7q6zYyO..T7zY', // password
            role: 'admin'
        });

        // Resident
        this.users.push({
            _id: 'u2',
            name: 'John Resident',
            email: 'john@example.com',
            password: '$2a$10$89.G3D..Tz4/GvK.r6fX/u7q6zYyO..T7zY/u7q6zYyO..T7zY', // password
            role: 'resident',
            flatId: 'f1'
        });

        this.flats.push({
            _id: 'f1',
            flatNumber: '101',
            floor: 1,
            ownerName: 'John Resident',
            residents: ['u2']
        });

        this.usage.push({ _id: 'm1', flatId: 'f1', reading: 12.5, readingDate: new Date() });
    }
}

const db = new MockDB();
module.exports = db;
