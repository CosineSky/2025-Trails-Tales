// server/index.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

// 路由模块
const registerRoutes = require('./routes/management/register');
const loginRoutes = require('./routes/management/login');
const journalsRoutes = require('./routes/management/journals/items');
const modifyRoutes = require('./routes/management/journals/modify');
const ossRoutes = require('./routes/app/utils/oss');
const profileRoutes = require('./routes/app/users/profile');
const uploadRoutes = require('./routes/management/journals/upload');

const likeRoutes = require('./routes/app/users/like');
const followRoutes = require('./routes/app/users/follow');
const commentRoutes = require('./routes/app/users/comment');

// 挂载路由（使用统一前缀）
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api/journals', journalsRoutes);
app.use('/api/journals', modifyRoutes);
app.use('/api/utils', ossRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/journals', uploadRoutes);

app.use('/api/like', likeRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/comment', commentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


