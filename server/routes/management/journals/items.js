const express = require('express');
const router = express.Router();
const db = require('../../../db');

router.get('/items', (req, res) => {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const pageSize = req.query.page ? 10 : 32767;
    const offset = (page - 1) * pageSize;

    let sql = `
        SELECT 
            journals.*, 
            users.nickname AS owner_nickname,
            users.avatar AS owner_avatar_url
        FROM journals
        LEFT JOIN users ON journals.owner_id = users.id
        WHERE journals.status != 3
    `;
    let params = [];

    if (search) {
        sql += ' AND journals.title LIKE ?';
        params.push(`%${search}%`);
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            return res.status(200).json(results);
        }
    });
});


router.get('/getById', (req, res) => {
    const targetId = req.query.search;

    const journalSql = `
        SELECT
            journals.*,
            users.nickname AS owner_nickname,
            users.avatar AS owner_avatar_url
        FROM journals
                 LEFT JOIN users ON journals.owner_id = users.id
        WHERE journals.id = ?
    `;

    const picturesSql = `
        SELECT 
            resource_url 
        FROM pictures 
        WHERE journal_id = ?
    `;

    db.query(journalSql, [targetId], (err, journalResults) => {
        if (err || journalResults.length === 0) {
            return res.status(404).json({ error: err?.message || 'Journal not found' });
        }

        const journal = journalResults[0];
        db.query(picturesSql, [targetId], (picErr, picResults) => {
            if (picErr) {
                return res.status(500).json({ error: picErr.message });
            }

            journal.pictures = picResults.map(row => row.resource_url);
            return res.status(200).json(journal);
        });
    });
});


module.exports = router;
