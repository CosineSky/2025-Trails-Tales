const express = require('express');
const router = express.Router();
const db = require('../../../db');


/*
    Follow.
 */
router.post('/follow', (req, res) => {
    const { follower_id, followee_id } = req.body;
    const sql = 'INSERT INTO follows (follower_id, followee_id) VALUES (?, ?)';
    db.query(sql, [follower_id, followee_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(201).json({ message: '关注成功' });
        }
    });
});


/*
    Unfollow.
 */
router.delete('/follow', (req, res) => {
    const { follower_id, followee_id } = req.body;
    const sql = 'DELETE FROM follows WHERE follower_id = ? AND followee_id = ?';
    db.query(sql, [follower_id, followee_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json({ message: '已取消关注' });
        }
    });
});


/*
    Getting the amount of followers & followees.
 */
router.get('/follow/stats/:user_id', (req, res) => {
    const { user_id } = req.params;

    const sqlFollowers = 'SELECT COUNT(*) AS followers FROM follows WHERE followee_id = ?';
    const sqlFollowing = 'SELECT COUNT(*) AS following FROM follows WHERE follower_id = ?';

    db.query(sqlFollowers, [user_id], (err1, result1) => {
        if (err1) {
            return res.status(500).json({ error: err1.message });
        }

        db.query(sqlFollowing, [user_id], (err2, result2) => {
            if (err2) {
                return res.status(500).json({ error: err2.message });
            }
            else {
                return res.status(200).json({
                    user_id,
                    followers: result1[0].followers,
                    following: result2[0].following,
                });
            }
        });
    });
});


module.exports = router;
