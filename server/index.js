// server/index.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;


const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://115.175.40.241:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.options('*', cors());
app.use(express.json());

// 路由模块
const registerRoutes = require('./routes/management/register');
const loginRoutes = require('./routes/management/login');
const journalsRoutes = require('./routes/management/journals/items');
const modifyRoutes = require('./routes/management/journals/modify');
const ossRoutes = require('./routes/app/utils/oss');
const profileRoutes = require('./routes/app/users/profile');

// 挂载路由（使用统一前缀）
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api/journals', journalsRoutes);
app.use('/api/journals', modifyRoutes);
app.use('/api/utils', ossRoutes);
app.use('/api/users', profileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


