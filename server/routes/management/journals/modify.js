const express = require('express');
const router = express.Router();
const db = require('../../../db');


// Accept a journal
router.put('/approve/:id', (req, res) => {
    console.log("acc: ", res.body);
    console.log("acc: ", req.params, req.body);
    const { id } = req.params;
    const sql = 'UPDATE journals SET status = 1 WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '游记已通过审核' });
    });
});


// Reject a journal
router.put('/reject/:id', (req, res) => {
    console.log("rej: ", res.body);
    console.log("rej: ", req.params, req.body);

    const { id } = req.params;
    const { rejectionReason } = req.body; // 拒绝理由

    if (!rejectionReason) {
        return res.status(400).json({ error: '拒绝理由不能为空' });
    }

    const sql = 'UPDATE journals SET status = 2, detail_status = ? WHERE id = ?';
    db.query(sql, [rejectionReason, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '游记已被拒绝' });
    });
});


// Delete a journal
router.put('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'UPDATE journals SET status = 3 WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: '游记已删除' });
    });
});


module.exports = router;
