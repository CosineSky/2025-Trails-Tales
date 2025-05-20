const express = require('express');
const router = express.Router();
const db = require('../../../db');
const authenticateToken = require('../../../utils/TokenDecoder');

/*
    修改用户个人信息
    @param id 用户id
    @param nickname 用户昵称
    @param avatar 用户头像
 */
router.post('/profile/update', authenticateToken,(req, res) => {
    const { id, nickname, avatar } = req.body;
    if (!nickname || !avatar) {
        return res.status(400).json({ error: 'Nickname or avatar can\'t be empty!' });
    }

    const sql = 'UPDATE users SET nickname = ?, avatar = ? WHERE id = ?';
    db.query(sql, [nickname, avatar, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        //若没有修改任何一行数据，则代表该用户不存在
        else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not existed!' });
        }
        else {
            return res.status(200).json({ message: 'Successfully updated user profile!' });
        }

    });
});


/*
    获取用户个人信息
    @param id 用户id
 */
router.get('/profile/fetch', authenticateToken,(req, res) => {
    const { id } = req.query;       //请求使用查询参数，并未使用请求体
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
