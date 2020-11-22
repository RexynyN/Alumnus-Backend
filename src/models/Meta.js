const { Model, DataTypes } = require('sequelize');

class Meta extends Model {
    static init(connection) {
        super.init({
            descricaoMeta: DataTypes.STRING,
            pontosMeta: DataTypes.INTEGER,
            situacaoMeta: DataTypes.INTEGER,
        }, {
            sequelize: connection
        })
    }

    static associate(models) {
        this.belongsTo(models.Publicacao, { foreignKey: 'idAtividade', as: 'atividade' });
    }
}

module.exports = Meta;