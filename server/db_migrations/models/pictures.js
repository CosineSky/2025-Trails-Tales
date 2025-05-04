const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('pictures', {
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
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(256),
            allowNull: true,
        },
        resource_url: {
            type: DataTypes.STRING(256),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'pictures',
        timestamps: false
    });
};
