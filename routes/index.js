'use strict';

const express = require('express');
const router = express.Router();
const { sequelize } = require('../db');

const users = require('./users');
const courses = require('./courses');

console.log('Testing the connection to the database...');

(async () => {
  try {
    // Test the connection to the database
    console.log('Connection to the database successful!');
    await sequelize.authenticate();

    // Sync the models
    console.log('Synchronizing the models with the database...');
    await sequelize.sync();

  } catch (error) {
       throw error;
 }
})();

// Add routes.
router.use('/users', users);
router.use('/courses', courses);

module.exports = router;
