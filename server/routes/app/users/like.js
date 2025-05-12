const express = require('express');
const router = express.Router();
const db = require('../../../db');
const authenticateToken = require('../../../utils/TokenDecoder');

/*
    Like.
 */
router.post('/like', authenticateToken,(req, res) => {
    const { journal_id, user_id } = req.body;
    const sql = 'INSERT INTO likes (journal_id, user_id) VALUES (?, ?)';
    db.query(sql, [journal_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json({ message: 'Liked!' });
        }
    });
});


/*
    Dislike.
 */
router.delete('/like', authenticateToken,(req, res) => {
    const { journal_id, user_id } = req.body;
    const sql = 'DELETE FROM likes WHERE journal_id = ? AND user_id = ?';
    db.query(sql, [journal_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json({ message: 'Disliked!' });
        }
    });
});


/*
    Getting the amount of likes of a journal.
 */
router.get('/like/count/:journal_id',authenticateToken, (req, res) => {
    const { journal_id } = req.params;
    const sql = 'SELECT COUNT(*) AS count FROM likes WHERE journal_id = ?';
    db.query(sql, [journal_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            res.status(200).json({ journal_id, count: results[0].count });
        }
    });
});


/*
    Decide if a user liked a specific journal.
 */
router.get('/like/status', authenticateToken,(req, res) => {
    const { journal_id, user_id } = req.query;

    if (!journal_id || !user_id) {
        return res.status(400).json({ error: 'Missing journal_id or user_id!' });
    }

    const sql = 'SELECT 1 FROM likes WHERE journal_id = ? AND user_id = ? LIMIT 1';
    db.query(sql, [journal_id, user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const liked = results.length > 0;
        return res.status(200).json({ liked });  // Returns { liked: true | false }
    });
});


module.exports = router;
