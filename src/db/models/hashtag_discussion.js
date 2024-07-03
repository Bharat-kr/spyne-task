'use strict';
// Packages
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Hashtag_Discussion extends Model {
    static associate({ Discussion, Hashtag }) {
      this.belongsTo(Discussion, { foreignKey: 'discussion_id' });
      this.belongsTo(Hashtag, { foreignKey: 'hashtag_id' });
    }
  }
  Hashtag_Discussion.init(
    {
      discussion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hashtag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
