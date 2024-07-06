'use strict';
// Packages
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Follower extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    }
  }
  Follower.init(
    {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      sequelize,
      tableName: 'follower',
      modelName: 'Follower',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Follower;
};
