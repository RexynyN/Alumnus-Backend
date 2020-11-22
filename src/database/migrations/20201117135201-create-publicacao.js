'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Publicacaos',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      idUsuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      titulo: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      conteudo: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      apreciacoes: {
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
    await queryInterface.dropTable('Publicacaos');
  }
};
