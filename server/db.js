const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'tales',
    allowPublicKeyRetrieval: true,
});

connection.connect(err => {
    if (err) {
        console.error('❌ Error during connecting to the database: ', err);
    } else {
        console.log('✅ Successfully connected to the database!');
    }
});

module.exports = connection;
