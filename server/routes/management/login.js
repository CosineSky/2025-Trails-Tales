// routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'DB Error' });
        }
        else if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        else {
            const user = results[0];
            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role },
                'your-secret-key',
                { expiresIn: '24h' }
            );
            return res.status(200).json({ token });
        }


    });
});

module.exports = router;
