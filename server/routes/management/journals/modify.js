const express = require('express');
const router = express.Router();
const db = require('../../../db');


/*
    Accepting a journal
 */
router.put('/approve/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'UPDATE journals SET status = 1 WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json({ message: 'Successfully accepted the journal!' });
        }
    });
});


/*
    Rejecting a journal
 */
router.put('/reject/:id', (req, res) => {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    if (!rejectionReason) {
        return res.status(400).json({ error: 'Reject reason cannot be empty!' });
    }

    const sql = 'UPDATE journals SET status = 2, detail_status = ? WHERE id = ?';
    db.query(sql, [rejectionReason, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json({ message: 'Successfully rejected the journal!' });
        }
    });
});


/*
    Deleting a journal
 */
router.put('/delete/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'UPDATE journals SET status = 3 WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json({ message: 'Successfully deleted the journal!' });
        }
    });
});


module.exports = router;
