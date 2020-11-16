const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
    static init(connection) {
        super.init({
            email: DataTypes.STRING,
            senha: DataTypes.STRING(32),
            nickname: DataTypes.STRING(32),
            descricaoPerfil: DataTypes.STRING,
            pontuacao: DataTypes.INTEGER,
            avatar: DataTypes.INTEGER,
            tipoUsuario: DataTypes.INTEGER,
            loginToken: DataTypes.STRING,
            tokenSpan: DataTypes.STRING,
        }, {
            sequelize: connection
        })
    }
}

module.exports = Usuario;