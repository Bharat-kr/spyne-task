'use strict';
// Packages
const { Model } = require('sequelize');
const User = require('./user');
const Discussion = require('./discussion');

module.exports = (sequelize, Sequelize) => {
  class Comment extends Model {
    static associate({ Discussion, User, Comment }) {
      this.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      this.belongsTo(Discussion, {
        foreignKey: 'discussion_id',
        onDelete: 'CASCADE',
      });
      this.belongsTo(Comment, {
        foreignKey: 'comment_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Comment.init(
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
        references: {
          model: User,
          key: 'id',
        },
      },
      discussion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Discussion,
          key: 'id',
        },
      },
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: Comment,
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
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
      tableName: 'comment',
      modelName: 'Comment',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Comment;
};
