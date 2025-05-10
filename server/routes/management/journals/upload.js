const express = require('express');
const router = express.Router();
const db = require('../../../db');
const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; // 附加到请求中
        next();
    });
}


router.post('/upload', /* authenticateToken, */ (req, res) => {
    console.log(`in upload.js:`);
    console.log(req.body);
    const { title, content, cover_url, video_url, pictures } = req.body;
    const owner_id = 2;
    // const owner_id = req.user.userId;
    if (!title || !content || !cover_url || !Array.isArray(pictures)) {
        return res.status(400).json({ message: 'Invalid request body' });
    }

    const insertJournalSql = 'INSERT INTO journals (title, content, cover_url, video_url, owner_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())';

    db.query(insertJournalSql, [title, content, cover_url, video_url || null, owner_id], (err, result) => {
        if (err) {
            console.error('Error inserting journal:', err);
            return res.status(500).json({ message: 'Database error inserting journal' });
        }

        const journalId = result.insertId;
        if (pictures.length === 0) {
            return res.status(200).json({ message: 'Journal uploaded (no pictures)', journalId });
        }

        const insertPicsSql = 'INSERT INTO pictures (journal_id, resource_url) VALUES ?';
        const pictureValues = pictures.map(pic => [journalId, pic]);

        db.query(insertPicsSql, [pictureValues], (err2) => {
            if (err2) {
                console.error('Error inserting pictures:', err2);
                return res.status(500).json({ message: 'Database error inserting pictures' });
            }

            return res.status(200).json({ message: 'Journal uploaded successfully', journalId });
        });
    });
});

module.exports = router;
