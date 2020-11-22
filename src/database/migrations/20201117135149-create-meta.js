'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Meta',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      idAtividade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Atividades', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      descricaoMeta: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      pontosMeta: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      situacaoMeta: {
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
    await queryInterface.dropTable('Meta');
  }
};
