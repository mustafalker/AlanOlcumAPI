const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../utility/database');

const Drawing = sequelize.define('Drawing', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    measurement: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
}, {});

Drawing.associate = function (models) {
    Drawing.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = Drawing;
