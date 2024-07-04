'use strict';
// Packages
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Discussion extends Model {
    static associate({ User, Hashtag_Discussion }) {
      this.belongsTo(User, { foreignKey: 'user_id' });
      this.hasMany(Hashtag_Discussion, { foreignKey: 'discussion_id' });
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
