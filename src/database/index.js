

const Sequelize = require('sequelize');
const dbconfig = require('../config/database');

const Usuario = require('../models/Usuario');
const Atividade = require('../models/Atividade');

const connection = new Sequelize (dbconfig);

Usuario.init(connection);
Atividade.init(connection);

Atividade.associate(connection.models);


module.exports = connection;