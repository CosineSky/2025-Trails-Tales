const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('follows', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        followee_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        follower_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'follows',
        timestamps: false,
    });
};
