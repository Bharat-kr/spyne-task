'use strict';
// Packages
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Discussion extends Model {
    static associate({ User, Hashtag, Comment }) {
      this.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      this.belongsToMany(Hashtag, {
        through: 'hashtag_discussion',
        sourceKey: 'id',
        foreignKey: 'discussion_id',
        as: 'hashtags',
        onDelete: 'CASCADE',
      });
      this.hasMany(Comment, {
        foreignKey: 'discussion_id',
        onDelete: 'CASCADE',
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
      likes_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
