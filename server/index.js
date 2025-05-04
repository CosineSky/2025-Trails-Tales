// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors()); // 允许跨域
app.use(express.json());

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from Node.js backend!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
