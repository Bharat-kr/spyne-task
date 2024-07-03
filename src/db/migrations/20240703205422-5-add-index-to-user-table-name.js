'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('user', ['name'], {
      name: 'user_name_index',
      using: 'BTREE', // You can specify the type of index if needed, such as BTREE or HASH
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('user', 'user_name_index');
  },
};
