// server/index.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;


app.use(cors()); // 允许跨域
app.use(express.json());

// 路由模块
const registerRoutes = require('./routes/user/register');
const loginRoutes = require('./routes/user/login');

// 挂载路由（使用统一前缀）
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


