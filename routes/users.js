'use strict';

const express = require('express');
const router = express.Router();
const { models } = require('../db');
const { User } = models;
const { validationResult } = require('express-validator');

const {
  authenticateUser,
  checkUserValidationChain,
  handleErrorMessage,
  hashPassword
} = require("./includes/utilities");


// Route that returns the current authenticated user.
router.get('/', authenticateUser, (req, res) => {

  const user = req.currentUser;
  res.json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });

});

// Route that creates a new user.
router.post('/', checkUserValidationChain, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  let user = req.body;
  user.password = hashPassword(user.password);
  try {
    user = await User.create(user);
    return res.location('/').status(201).end();
  } catch (error) {
    const message = handleErrorMessage(error);
    return res.status(400).json({ errors: message });
  }
});

module.exports = router;
