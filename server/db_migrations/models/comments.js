const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('comments', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        journal_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        comment: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
    }, {
        tableName: 'comments',
        timestamps: false,
    });
};
