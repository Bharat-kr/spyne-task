'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'user',
      [
        {
          name: 'Bharat',
          email: 'kumabharat123@gmail.com',
          phone_number: '9711082565',
          password:
            '$2b$10$oV8rtMkvl5dIaxx0c6gDHeY0EZxMMHAgKYJDEkLYl/yxX3.FZfZTq',
          created_at: '2024-07-06 06:52:06',
          updated_at: '2024-07-06 06:52:06',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  },
};
