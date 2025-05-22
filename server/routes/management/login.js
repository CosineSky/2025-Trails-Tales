const express = require('express');
const router = express.Router();
const db = require('../../db');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');


/*
    Login
 */
router.post(
    '/login',
    [
        body('username').isString().isLength({ min: 1, max: 16 }).trim().escape(),
        body('password').isString().isLength({ min: 6, max: 32 }).trim().escape(),
    ],
    (req, res) => {
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
                //生成token
                const token = jwt.sign(
                    { userId: user.id, username: user.username, role: user.role },
                    'i-dont-know-what-to-put-here',
                    { expiresIn: '24h' }
                );
                return res.status(200).json({ token });     //token返回给前端
            }

        });
    }
);


module.exports = router;
