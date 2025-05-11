const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');

const router = express.Router();

/*
    Configuration of Aliyun-OSS
 */
const client = new OSS({
    region: 'oss-cn-nanjing', /* oss-cn-nanjing.aliyuncs.com */
    accessKeyId: 'LTAI5t7WL4vdSAKDs2pWFa5o',
    accessKeySecret: 'GY3PDQaeiLQF3cX2gZD3P2s2lBJtPt',
    bucket: 'bucket-cloudsky',
});


// 使用 multer 接收 multipart/form-data
// 指定临时存储位置
const upload = multer({dest: 'uploads/'});


router.post('/oss', upload.single('avatar'), async (req, res) => {
    const file = req.file;
    const ext = path.extname(file.originalname);
    const objectName = `${Date.now()}${ext}`;
    const localPath = file.path;

    try {
        const result = await client.put(objectName, localPath);
        fs.unlinkSync(localPath); // 上传后删除本地临时文件
        return res.status(200).json({url: result.url});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
});

module.exports = router;
