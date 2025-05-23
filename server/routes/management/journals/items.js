const express = require("express");
const router = express.Router();
const db = require("../../../db");
const {journalsLimiter} = require("../../../accessLimiter");


const MAX_PAGE_SIZE = 50;
const DEFAULT_PAGE_SIZE = 10;


/*
    查看游记列表
    @param search 搜索关键词
    @param page 页码
 */
router.get('/items', journalsLimiter, (req, res) => {
    const search = (typeof req.query.search === 'string'
        && req.query.search.length <= 50) ? req.query.search : null;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSizeRaw = parseInt(req.query.pageSize) || DEFAULT_PAGE_SIZE;
    const pageSize = Math.min(pageSizeRaw, MAX_PAGE_SIZE);
    const offset = (page - 1) * pageSize;

    // 获取已审核通过(status = 1)的游记信息、发布者昵称、发布者头像。journal表和 user表连表查询
    let sql = `
        SELECT
            journals.*,
            users.nickname AS owner_nickname,
            users.avatar AS owner_avatar_url
        FROM journals
        LEFT JOIN users ON journals.owner_id = users.id
        WHERE journals.status = 1
    `;
    let params = [];

    //若搜索关键词存在，则额外插入搜索条件
    if (search) {
        sql += ' AND (journals.title LIKE ? OR users.nickname LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);      //填充参数
    }

    sql += ' ORDER BY journals.created_at DESC LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        else {
            return res.status(200).json({
                page,
                pageSize,
                results
            });
        }
    });
});


/*
    Getting a list of journals
 */
router.get('/all', journalsLimiter, (req, res) => {
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const pageSize = req.query.page ? 10 : 32767;
    const offset = (page - 1) * pageSize;

    let sql = `
        SELECT
            journals.*,
            users.nickname AS owner_nickname,
            users.avatar AS owner_avatar_url
        FROM journals
                 LEFT JOIN users ON journals.owner_id = users.id
    `;
    let params = [];

    if (search) {
        sql += ' AND (journals.title LIKE ? OR users.nickname LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    db.query(sql, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        else {
            return res.status(200).json(results);
        }
    });
});


/*
    Getting the detailed information by journal ID.
 */
router.get('/getById', journalsLimiter, (req, res) => {
    const targetId = req.query.search;

    const journalSql = `
        SELECT
            journals.*,
            users.nickname AS owner_nickname,
            users.avatar AS owner_avatar_url
        FROM journals
                 LEFT JOIN users ON journals.owner_id = users.id
        WHERE journals.id = ?
    `;
    const picturesSql = `
        SELECT
            resource_url
        FROM pictures
        WHERE journal_id = ?
    `;

    db.query(journalSql, [targetId], (err, journalResults) => {
        if (err || journalResults.length === 0) {
            return res.status(404).json({ error: err?.message || 'Journal not found' });
        }

        const journal = journalResults[0];
        db.query(picturesSql, [targetId], (picErr, picResults) => {
            if (picErr) {
                return res.status(500).json({ error: picErr.message });
            }

            journal.pictures = picResults.map(row => row.resource_url);
            return res.status(200).json(journal);
        });
    });
});


/*
    Getting a list of journal posted by the target user, only those not deleted.
 */
router.get('/getByOwnerId', journalsLimiter, (req, res) => {
    const ownerId = req.query.owner_id;

    if (!ownerId) {
        return res.status(400).json({ error: 'owner_id is required' });
    }

    const journalSql = `
        SELECT
            journals.*,
            users.nickname AS owner_nickname,
            users.avatar AS owner_avatar_url
        FROM journals
                 LEFT JOIN users ON journals.owner_id = users.id
        WHERE journals.owner_id = ? AND journals.status != 3
        ORDER BY journals.created_at DESC
    `;

    const picturesSql = `
        SELECT
            journal_id,
            resource_url
        FROM pictures
        WHERE journal_id IN (
            SELECT id FROM journals WHERE owner_id = ?
        )
    `;

    db.query(journalSql, [ownerId], (err, journalResults) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (journalResults.length === 0) {
            return res.status(200).json([]);
        }

        db.query(picturesSql, [ownerId], (picErr, picResults) => {
            if (picErr) {
                return res.status(500).json({ error: picErr.message });
            }
            const pictureMap = {};
            picResults.forEach(row => {
                if (!pictureMap[row.journal_id]) {
                    pictureMap[row.journal_id] = [];
                }
                pictureMap[row.journal_id].push(row.resource_url);
            });

            // 合并图片
            const journalsWithPictures = journalResults.map(j => ({
                ...j,
                pictures: pictureMap[j.id] || []
            }));

            return res.status(200).json(journalsWithPictures);
        });
    });
});


module.exports = router;
