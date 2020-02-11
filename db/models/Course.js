'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model { }

  Course.init({
    title: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"title" is required'
          }
        }
      },
    description: {
        type: Sequelize.TEXT,
        validate: {
          notEmpty: {
            msg: '"Text" is required'
          }
        },
    estimatedTime: Sequelize.STRING,
    materialsNeeded: Sequelize.STRING    
    },
  }, { sequelize });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: true,
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return Course;
};