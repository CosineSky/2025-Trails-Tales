const express = require('express');
const router = express.Router();
const db = require('../../../db');
const authenticateToken = require('../../../utils/TokenDecoder');

/**
 * 创建评论
 * @param  journal_id 日记id
 * @param  user_id 用户id
 * @param  comment 评论内容
 */
router.post('/comment', authenticateToken , (req, res) => {
    const { journal_id, user_id, comment } = req.body;
    const sql = 'INSERT INTO comments (journal_id, user_id, comment, created_at) VALUES (?, ?, ?, NOW())';
    //给数据库发起请求。参数为中括号内包裹的所有字段，按顺序替换sql语句中的"?"字符
    db.query(sql, [journal_id, user_id, comment], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(201).json({ message: '评论成功' });
        }
    });
});


/**
 * 检索评论
 * @param  journal_id 日记id
 */
router.get('/comment/:journal_id', authenticateToken ,(req, res) => {
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
