const Sequelize = require('sequelize');

const sequelize = new Sequelize('AlanOlcum', 'sa', '123456789Mustafa', {
    host: 'localhost',
    port: 1434,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true, 
            trustServerCertificate: true 
        }
    }
});

module.exports = sequelize;
