'use strict';

// Packages
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Hashtag extends Model {
    static associate({ Discussion }) {
      this.belongsToMany(Discussion, {
        through: 'hashtag_discussion',
        sourceKey: 'id',
        foreignKey: 'hashtag_id',
      });
    }
  }
  Hashtag.init(
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      sequelize,
      tableName: 'hashtag',
      modelName: 'Hashtag',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Hashtag;
};
