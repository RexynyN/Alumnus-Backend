const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
    static init(connection) {
        super.init({
            email: DataTypes.STRING,
            senha: DataTypes.STRING,
            nickname: DataTypes.STRING,
            descricaoPerfil: DataTypes.STRING,
            pontuacao: DataTypes.INTEGER,
            avatar: DataTypes.INTEGER,
            tipoUsuario: DataTypes.INTEGER,
            loginToken: DataTypes.STRING,
            tokenSpan: DataTypes.STRING,
        }, {
            sequelize: connection
        });
    }

    static associate(models) {
        this.hasMany(models.Atividade, { foreignKey: 'idUsuario', as: 'atividades' });
        this.hasMany(models.Publicacao, { foreignKey: 'idUsuario', as: 'publicacoes' });
        this.hasMany(models.Tag, { foreignKey: 'idUsuario', as: 'tags' });
        this.hasMany(models.Denuncia, { foreignKey: 'idUsuario', as: 'denuncias' });

      }
}

module.exports = Usuario;