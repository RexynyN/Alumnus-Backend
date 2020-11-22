//Para criar migrations => yarn sequelize migration:create --name=<nome da migration>
//Para desfazer => yarn sequelize db:migrate:undo
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Atividades',
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

        tempoCumprido: {
          type: Sequelize.TIME,
          allowNull: false,
        },

        agrupador: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        titulo: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        descricao: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        numeroMetas: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        anotacao: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        pontos: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        tempoPrevisto: {
          type: Sequelize.TIME,
          allowNull: false,
        },

        dataAtividade: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        statusAtividade: {
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
    await queryInterface.dropTable('Atividades');
  }
};
