const express = require('express');
const router = express.Router();
const db = require('../../../db');


// 点赞
router.post('/like', (req, res) => {
    const { journal_id, user_id } = req.body;
    const sql = 'INSERT INTO likes (journal_id, user_id) VALUES (?, ?)';
    db.query(sql, [journal_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json({ message: '点赞成功' });
        }
    });
});


// 取消点赞
router.delete('/like', (req, res) => {
    const { journal_id, user_id } = req.body;
    const sql = 'DELETE FROM likes WHERE journal_id = ? AND user_id = ?';
    db.query(sql, [journal_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json({ message: '已取消点赞' });
        }
    });
});


// 获取某篇游记的点赞数
router.get('/like/count/:journal_id', (req, res) => {
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


// 判断是否已点赞
router.get('/like/status', (req, res) => {
    const { journal_id, user_id } = req.query;
    console.log(journal_id, user_id);

    if (!journal_id || !user_id) {
        return res.status(400).json({ error: '缺少 journal_id 或 user_id 参数' });
    }

    const sql = 'SELECT 1 FROM likes WHERE journal_id = ? AND user_id = ? LIMIT 1';
    db.query(sql, [journal_id, user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const liked = results.length > 0;
        return res.status(200).json({ liked });  // 返回 { liked: true } 或 { liked: false }
    });
});


module.exports = router;
