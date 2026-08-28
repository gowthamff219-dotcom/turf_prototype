const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to Database
const db = new sqlite3.Database('./turf.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            location TEXT,
            turfId TEXT,
            date TEXT,
            slot TEXT,
            customerName TEXT,
            phone TEXT,
            paymentMethod TEXT,
            price INTEGER
        )`);
    }
});

// Helper for price
function getPriceForSlot(timeSlot, location) {
    const isPM = timeSlot.includes('PM');
    let hourStr = timeSlot.split(':')[0];
    let hour = parseInt(hourStr);
    
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    
    // Pricing based on 5 locations
    const prices = {
        'downtown': 2000,
        'northside': 1500,
        'eastside': 1200,
        'westend': 1800,
        'central': 2500
    };
    
    let basePrice = prices[location] || 1500;
    // Peak hours 5 PM (17:00) onwards add ₹500
    return hour >= 17 ? basePrice + 500 : basePrice;
}

// Get slots for specific location and turf
app.get('/api/slots/:location/:turfId/:date', (req, res) => {
    const { location, turfId, date } = req.params;
    const allSlots = [
        "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM",
        "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
    ];

    db.all(`SELECT slot, customerName FROM bookings WHERE location = ? AND turfId = ? AND date = ?`, 
    [location, turfId, date], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const bookedMap = {};
        rows.forEach(row => { bookedMap[row.slot] = row.customerName; });

        const slotsStatus = allSlots.map(slot => ({
            time: slot,
            price: getPriceForSlot(slot, location),
            isBooked: !!bookedMap[slot],
            customerName: bookedMap[slot] || null
        }));

        res.json(slotsStatus);
    });
});

// Create booking
app.post('/api/book', (req, res) => {
    const { location, turfId, date, slot, customerName, phone, paymentMethod } = req.body;
    
    if (!location || !turfId || !date || !slot || !customerName || !phone || !paymentMethod) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const price = getPriceForSlot(slot, location);

    db.get(`SELECT * FROM bookings WHERE location = ? AND turfId = ? AND date = ? AND slot = ?`, 
    [location, turfId, date, slot], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(409).json({ error: "Slot already booked!" });

        db.run(`INSERT INTO bookings (location, turfId, date, slot, customerName, phone, paymentMethod, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [location, turfId, date, slot, customerName, phone, paymentMethod, price], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, bookingId: this.lastID, price });
        });
    });
});

// Get bookings by phone (for cancelation)
app.get('/api/my-bookings/:phone', (req, res) => {
    const { phone } = req.params;
    db.all(`SELECT * FROM bookings WHERE phone = ? ORDER BY date DESC, slot ASC`, [phone], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Cancel booking
app.delete('/api/book/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM bookings WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Booking not found" });
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
