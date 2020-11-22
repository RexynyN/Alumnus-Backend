

const Sequelize = require('sequelize');
const dbconfig = require('../config/database');

const Usuario = require('../models/Usuario');
const Atividade = require('../models/Atividade');
const Meta = require('../models/Meta');
const Publicacao = require('../models/Publicacao');
const Tag = require('../models/Tag');
const Denuncia = require('../models/Denuncia');

const connection = new Sequelize (dbconfig);

Usuario.init(connection);
Atividade.init(connection);
Meta.init(connection);
Publicacao.init(connection);
Tag.init(connection);
Denuncia.init(connection);

Usuario.associate(connection.models);
Atividade.associate(connection.models);
Meta.associate(connection.models);
Publicacao.associate(connection.models);
Tag.associate(connection.models);
Denuncia.associate(connection.models);


module.exports = connection;