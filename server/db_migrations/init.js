const { Sequelize } = require('sequelize');
const defineUsersModel = require('./models/users');
const defineJournalsModel = require('./models/journals');
const definePicturesModel = require('./models/pictures');


const sequelize = new Sequelize('tales', 'root', '1qaz', {
    host: 'localhost',
    dialect: 'mysql',
});


defineUsersModel(sequelize);
defineJournalsModel(sequelize);
definePicturesModel(sequelize);


sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Successfully synced the database.');
}).catch(err => {
    console.error('❌ Error during syncing database: ', err);
});
