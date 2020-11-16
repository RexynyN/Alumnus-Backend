const { Model, DataTypes } = require('sequelize');

class Atividade extends Model {
    static init(connection) {
        super.init({
            tempoCumprido: DataTypes.TIME,
            agrupador: DataTypes.STRING,
            titulo: DataTypes.STRING,
            descricao: DataTypes.STRING,
            numeroMetas: DataTypes.INTEGER,
            anotacao: DataTypes.STRING,
            pontos: DataTypes.INTEGER,
            tempoPrevisto: DataTypes.TIME,
            dataAtividade: DataTypes.DATE,
            statusAtividade: DataTypes.INTEGER,
        }, {
            sequelize: connection
        })
    }

    static associate(models) {
        this.belongsTo(models.Usuario, { foreignKey: 'idUsuario', as: 'usuario' });
      }
}

module.exports = Atividade;