const express = require('express');
const router = express.Router();
const db = require('../../../db');

router.get('/items', (req, res) => {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;        // 当前页码，默认为第1页
    const pageSize = req.query.page ? 10 : 32767;      // 每页条数
    const offset = (page - 1) * pageSize;              // 偏移量

    let sql = 'SELECT * FROM journals WHERE status != 3';
    let params = [];

    if (search) {
        sql += ' AND title LIKE ?';
        params.push(`%${search}%`);
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            console.log(results.length);
            return res.status(200).json(results);
        }
    });
});

module.exports = router;
