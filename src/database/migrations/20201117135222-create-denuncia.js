'use strict';


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Denuncia',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      idPublicacao: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Publicacaos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      explicacao: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      motivo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {
      freezeTableName: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Denuncia');
  }
};
