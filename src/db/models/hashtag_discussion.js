'use strict';
// Packages
const { Model } = require('sequelize');
const Discussion = require('./discussion');
const Hashtag = require('./hashtag');

module.exports = (sequelize, Sequelize) => {
  class Hashtag_Discussion extends Model {
    static associate() {}
  }
  Hashtag_Discussion.init(
    {
      discussion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Discussion,
          key: 'id',
        },
      },
      hashtag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: Hashtag,
          key: 'id',
        },
      },
    },
    {
      timestamps: true,
      sequelize,
      tableName: 'hashtag_discussion',
      modelName: 'Hashtag_Discussion',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Hashtag_Discussion;
};
