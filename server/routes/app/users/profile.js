const express = require('express');
const router = express.Router();
const db = require('../../../db');

// 修改用户信息
router.post('/profile/update', (req, res) => {
    console.log("target: ", req.body);
    const { id, nickname, avatar } = req.body;
    if (!nickname || !avatar) {
        return res.status(400).json({ error: '昵称和头像URL不能为空' });
    }

    const sql = 'UPDATE users SET nickname = ?, avatar = ? WHERE id = ?';
    db.query(sql, [nickname, avatar, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else if (result.affectedRows === 0) {
            return res.status(404).json({ error: '用户不存在' });
        }
        else {
            console.log("NICE!");
            return res.status(200).json({ message: '用户信息更新成功' });
        }

    });
});


// 获取用户信息
router.get('/profile/fetch', (req, res) => {
    const { id } = req.query;
    const sql = 'SELECT id, username, nickname, avatar, role FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else if (results.length === 0) {
            return res.status(404).json({ error: '用户不存在' });
        }
        else {
            return res.status(200).json({ user: results[0] });
        }
    });
});



module.exports = router;
