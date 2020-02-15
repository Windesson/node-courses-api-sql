'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model { }

  User.init({
    firstName: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"firstName" is required'
        }
      }
    },
    lastName: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"lastName" is required'
          }
        }
      },
    emailAddress: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
          notEmpty: {
            msg: '"emailAddress" is required',
          },
          isEmail: {
            msg: 'invalid emailAddress. expected format (foo@bar.com)',
          }
        },
    },
    password: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: {
              msg: '"password" is required'
            }
           }
    }
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: true,
      },
    });
  };

  return User;
};