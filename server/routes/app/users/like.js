const express = require('express');
const router = express.Router();
const db = require('../../../db');
const authenticateToken = require('../../../utils/TokenDecoder');

/*
    用户点赞
    @param journal_id 被点赞的游记
    @param user_id 点赞的用户
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
    取消点赞
    @param journal_id 被取消点赞的游记
    @param user_id 取消点赞的用户
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
    获取一篇游记的点赞数
    @param journal_id 游记id
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
    查看用户对某篇游记的点赞状态
    @param journal_id 游记id
    @param user_id 用户id
 */
router.get('/like/status', authenticateToken,(req, res) => {
    const { journal_id, user_id } = req.query;

    //必须提供journal_id和user_id，否则返回4xx错误
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
