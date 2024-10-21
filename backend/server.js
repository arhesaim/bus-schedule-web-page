const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const path = require('path');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'study'
});

// Connect to the database
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint to get suggestions
app.get('/suggestions', (req, res) => {
    const searchTerm = req.query.q;
    const query = `SELECT stop_name FROM stops WHERE stop_name LIKE '%${searchTerm}%'`;
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.get('/buses', (req, res) => {
    const stopName = req.query.stop;
    const query = `SELECT bus_number FROM buses WHERE stop_name = ?`;
    db.query(query, [stopName], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});