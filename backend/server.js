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
    const stopName = req.query.q;
    const query = `select s.stop_name,r.route_short_name, t.trip_long_name, s.stop_desc, st.departure_time
                    from stops as s
                        join stop_times as st on s.stop_id = st.stop_id
                        join trips as t on t.trip_id = st.trip_id
                        join routes as r on t.route_id = r.route_id
                    where stop_name like '%${stopName}%'
                    ORDER BY TIME(st.departure_time);`;
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});