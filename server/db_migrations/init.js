const { Sequelize } = require('sequelize');
const defineUsersModel = require('./models/users');
const defineJournalsModel = require('./models/journals');
const definePicturesModel = require('./models/pictures');
const defineLikesModel = require('./models/likes');
const defineFollowsModel = require('./models/follows');
const defineCommentsModel = require('./models/comments');


const sequelize = new Sequelize('tales', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
});


defineUsersModel(sequelize);
defineJournalsModel(sequelize);
definePicturesModel(sequelize);
defineLikesModel(sequelize);
defineFollowsModel(sequelize);
defineCommentsModel(sequelize);


sequelize.sync({ alter: true }).then(() => {
    console.log('✅ Successfully synced the database.');
}).catch(err => {
    console.error('❌ Error during syncing database: ', err);
});
