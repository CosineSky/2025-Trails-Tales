const jwt = require("jsonwebtoken");
/*
    JWT Auth, prevents journal posting without login status.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token)
    console.log("token decoding...");
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'i-dont-know-what-to-put-here', { algorithms: ['HS256'] },(err, decoded) => {
        if (err) {
            console.log("验证失败:", err.message); // 输出具体的错误信息
            return res.sendStatus(403);
        }

        console.log("解码成功:", decoded); // 直接输出对象，便于查看完整内容
        req.user = decoded;
        next();
    });
    console.log("decode complete");
}

module.exports =  authenticateToken;
