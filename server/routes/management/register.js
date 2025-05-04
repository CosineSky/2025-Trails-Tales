// routes/register.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ message: 'Username exists' });
        }
        db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, /* Role */0], (err) => {
            if (err) {
                console.log("e3 ", err);
                return res.status(500).json({ message: 'Insert error' });
            }
            res.json({ message: 'Registered successfully' });
            console.log("hi3");
        });
        res.status(200).json({ message: 'Register successful' });
    });
});

module.exports = router;
