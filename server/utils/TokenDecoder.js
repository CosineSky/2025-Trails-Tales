const jwt = require("jsonwebtoken");
/*
    JWT Auth, prevents journal posting without login status.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, 'i-dont-know-what-to-put-here', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

export default authenticateToken;
