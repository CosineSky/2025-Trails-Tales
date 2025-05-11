const express = require('express');
const router = express.Router();
const db = require('../../../db');


/*
    Posting a comment.
 */
router.post('/comment', (req, res) => {
    const { journal_id, user_id, comment } = req.body;
    const sql = 'INSERT INTO comments (journal_id, user_id, comment, created_at) VALUES (?, ?, ?, NOW())';
    db.query(sql, [journal_id, user_id, comment], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(201).json({ message: '评论成功' });
        }
    });
});


/*
    Retrieving comment list.
 */
router.get('/comment/:journal_id', (req, res) => {
    const { journal_id } = req.params;
    const sql = 'SELECT * FROM comments WHERE journal_id = ? ORDER BY created_at DESC';
    db.query(sql, [journal_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json(results);
        }
    });
});


module.exports = router;
