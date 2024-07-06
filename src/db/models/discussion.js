'use strict';
// Packages
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Discussion extends Model {
    static associate({ User, Hashtag }) {
      this.belongsTo(User, { foreignKey: 'user_id' });
      this.belongsToMany(Hashtag, {
        through: 'hashtag_discussion',
        sourceKey: 'id',
        foreignKey: 'discussion_id',
        as: 'hashtags',
      });
    }
  }
  Discussion.init(
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      imagekit_file_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      sequelize,
      tableName: 'discussion',
      modelName: 'Discussion',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Discussion;
};
