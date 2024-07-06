'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hashtag_discussion', {
      discussion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'discussion',
          key: 'id',
        },
      },
      hashtag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hashtag',
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

    // Add composite unique constraint
    await queryInterface.addConstraint('hashtag_discussion', {
      fields: ['discussion_id', 'hashtag_id'],
      type: 'unique',
      name: 'unique_discussion_hashtag',
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove composite unique constraint
    await queryInterface.removeConstraint(
      'hashtag_discussion',
      'unique_discussion_hashtag'
    );

    await queryInterface.dropTable('hashtag_discussion');
  },
};
