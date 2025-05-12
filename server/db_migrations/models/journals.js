const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('journals', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(1024),
            allowNull: false,
        },
        cover_url: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        video_url: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
        view_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        like_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        detail_status: {
            type: DataTypes.STRING(1024),
            allowNull: true,
            defaultValue: '',
        },
        location: {
            type: DataTypes.STRING(1024),
            allowNull: true,
        }
    }, {
        tableName: 'journals',
        timestamps: false,
    });
};
