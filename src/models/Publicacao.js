const { Model, DataTypes } = require('sequelize');

class Publicacao extends Model {
    static init(connection) {
        super.init({
            titulo: DataTypes.STRING,
            conteudo: DataTypes.STRING,
            apreciacoes: DataTypes.INTEGER,
        }, {
            sequelize: connection
        })
    }

    static associate(models) {
        this.belongsTo(models.Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
    }
}

module.exports = Publicacao;