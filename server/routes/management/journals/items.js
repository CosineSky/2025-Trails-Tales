const express = require('express');
const router = express.Router();
const db = require('../../../db');

router.get('/items', (req, res) => {
    const sql = 'SELECT * FROM journals WHERE status != 3';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

module.exports = router;
