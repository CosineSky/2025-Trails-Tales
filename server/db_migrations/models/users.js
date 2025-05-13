const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: 'New Traveller',
        },
        avatar: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: 'https://bucket-cloudsky.oss-cn-nanjing.aliyuncs.com/trails-tales-default-avatar.jpg',
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'users',
        timestamps: false,
    });
};
