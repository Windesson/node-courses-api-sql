'use strict';

const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');

const users = require('./users');
const courses = require('./courses');

(async () => {
  try {
    // Test the connection to the database
    console.log('Testing the connection to the database..');
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync the models
    console.log('Synchronizing the models with the database...');
    await sequelize.sync();

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
})();


// Add routes.
router.use('/users', users);
router.use('/courses', courses);

module.exports = router;
