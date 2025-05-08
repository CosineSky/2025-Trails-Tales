// routes/register.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

router.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error' });
        }
        else if (results.length > 0) {
            return res.status(400).json({ message: 'Username exists' });
        }
        else {
            db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Insert error' });
                }
                else {
                    return res.status(200).json({ message: 'Register successful' });
                }
            });
        }
    });
});

module.exports = router;
