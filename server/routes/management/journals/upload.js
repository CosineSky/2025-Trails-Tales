const express = require('express');
const router = express.Router();
const db = require('../../../db');
const authenticateToken = require("../../../utils/TokenDecoder");
const { body, validationResult } = require('express-validator');


/*
    Posting a journal
 */
router.post(
    '/upload',
    authenticateToken,
    [
        body('title').isString().isLength({ min: 1, max: 32 }).trim().escape(),
        body('content').isString().isLength({ min: 1, max: 1024 }).trim().escape(),
        body('cover_url').isURL(),
        body('video_url').optional().isURL(),
        body('pictures').isArray(),
        body('pictures.*').isURL()
    ],
    (req, res) => {
        const { title, content, cover_url, video_url, pictures } = req.body;
        const owner_id = req.user.userId;
        if (!title || !content || !cover_url || !Array.isArray(pictures)) {
            return res.status(400).json({ message: 'Invalid request body' });
        }

        console.log('HI:', title, content, cover_url);

        const insertJournalSql = 'INSERT INTO journals (title, content, cover_url, video_url, owner_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())';

        db.query(insertJournalSql, [title, content, cover_url, video_url || null, owner_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error during uploading: ' + err });
            }

            // Getting the id of the journal posted just now, used for pictures uploading.
            const journalId = result.insertId;
            if (pictures.length === 0) {
                return res.status(200).json({ message: 'Journal uploaded (no pictures)', journalId });
            }

            // Journal with pictures
            // Inserting pictures to another table.
            const insertPicsSql = 'INSERT INTO pictures (journal_id, resource_url) VALUES ?';
            const pictureValues = pictures.map(pic => [journalId, pic]);

            db.query(insertPicsSql, [pictureValues], (err2) => {
                if (err2) {
                    return res.status(500).json({ message: 'Error inserting pictures:'+ err2 });
                }
                else {
                    return res.status(200).json({ message: 'Journal uploaded successfully', journalId });
                }
            });
        });
    }
);

module.exports = router;
