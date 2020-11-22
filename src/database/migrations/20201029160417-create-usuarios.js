//Para criar migrations => yarn sequelize migration:create --name=<nome da migration>
//Para desfazer => yarn sequelize db:migrate:undo
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Usuarios',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },

        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        senha: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        nickname: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        descricaoPerfil: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        pontuacao: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        avatar: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        tipoUsuario: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },

        loginToken: {
          type: Sequelize.STRING,
        },

        tokenSpan: {
          type: Sequelize.STRING,
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
    await queryInterface.dropTable('Usuarios');
  }
};
