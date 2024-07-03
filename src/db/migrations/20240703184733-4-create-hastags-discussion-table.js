'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hastag_discussion', {
      discussion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'discussion',
          key: 'id',
        },
      },
      hastag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hastag',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hastag_discussion');
  },
};
