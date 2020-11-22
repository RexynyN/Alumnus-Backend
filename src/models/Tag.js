const { Model, DataTypes } = require('sequelize');

class Tag extends Model {
    static init(connection) {
        super.init({
            nome: DataTypes.STRING,
        }, {
            sequelize: connection
        })
    }

    static associate(models) {
        this.belongsTo(models.Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
        this.belongsTo(models.Publicacao, { foreignKey: 'idPublicacao', as: 'publicacoes' });
    }
}

module.exports = Tag;