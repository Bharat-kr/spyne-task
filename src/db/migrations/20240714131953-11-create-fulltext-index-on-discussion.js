'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('discussion', {
      fields: ['text'],
      type: 'FULLTEXT',
      name: 'discussions_text',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('discussion', 'discussions_text');
  },
};
