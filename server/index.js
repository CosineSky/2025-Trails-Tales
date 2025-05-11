const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 5000;

/*
    Configs.
 */
app.use(cors());
app.use(express.json());


/*
    Routing modules.
 */
// users.
const registerRoutes = require('./routes/management/register');
const loginRoutes = require('./routes/management/login');
const profileRoutes = require('./routes/app/users/profile');
const likeRoutes = require('./routes/app/users/like');
const followRoutes = require('./routes/app/users/follow');
const commentRoutes = require('./routes/app/users/comment');

// journals.
const journalsRoutes = require('./routes/management/journals/items');
const modifyRoutes = require('./routes/management/journals/modify');
const uploadRoutes = require('./routes/management/journals/upload');

// utils
const ossRoutes = require('./routes/app/utils/oss');


/*
    Loading routes.
 */
// users.
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api/users', profileRoutes);
app.use('/api', likeRoutes);
app.use('/api', followRoutes);
app.use('/api', commentRoutes);

// journals.
app.use('/api/journals', journalsRoutes);
app.use('/api/journals', modifyRoutes);
app.use('/api/journals', uploadRoutes);

// utils.
app.use('/api/utils', ossRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


