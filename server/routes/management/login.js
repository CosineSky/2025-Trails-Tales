// routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error' });
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

module.exports = router;
