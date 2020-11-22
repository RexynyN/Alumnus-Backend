const { Model, DataTypes } = require('sequelize');

class Denuncia extends Model {
    static init(connection) {
        super.init({
            explicacao: DataTypes.STRING,
            motivo: DataTypes.INTEGER,

        }, {
            sequelize: connection
        })
    }

    static associate(models) {
        this.belongsTo(models.Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
        this.belongsTo(models.Publicacao, { foreignKey: 'idPublicacao', as: 'publicacaos' });
    }
}

module.exports = Denuncia;