const auth = require('basic-auth');
const models = require('../../db').models;
const User = models.User;
const bcryptjs = require('bcryptjs');

const { check, validationResult } = require('express-validator');

const authenticateUser = async (req, res, next) => {
    let message = null;
  
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
  
    // If the user's credentials are available...
    if (credentials) {
      // Attempt to retrieve the user from the data store
      // by their username (i.e. the user's "key"
      // from the Authorization header).
      let user = null;
      await User.findOne({
        where: {
          emailAddress: credentials.name,
        },
      }).then( result => user = result.dataValues);
  
  
      // If a user was successfully retrieved from the data store...
      if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcryptjs
      .compareSync(credentials.pass, user.password);
  
      // If the passwords match...
      if (authenticated) {
        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
       } else {
          message = `Authentication failure for username: ${user.username}`;
        }
      } else {
        message = `User not found for username: ${credentials.name}`;
      }
    } else {
      message = 'Auth header not found';
    }
  
    if (message) {
      console.warn(message);
      // Return a response with a 401 Unauthorized HTTP status code.
      res.status(401).json({ message: 'Access Denied' });
    } else {
      // Or if user authentication succeeded...
      // Call the next() method.
      next();
    }
};

const checkUserValidationChain = [
        check('firstName').exists({ checkNull: true, checkFalsy: true })
          .withMessage('Please provide a value for "firstName"'),
        check('lastName').exists({ checkNull: true, checkFalsy: true })
          .withMessage('Please provide a value for "lastName"'),
        check('emailAddress').exists({ checkNull: true, checkFalsy: true })
          .withMessage('Please provide a value for "emailAddress"'),    
        check('password').exists({ checkNull: true, checkFalsy: true })
          .withMessage('Please provide a value for "password"'),
];

const handleSequelizaValidation = async (callback) =>{
    try {
        await callback();      
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        error = error.errors.map(err => err.message);
      } 
      return res.status(400).json({ message: error});
    }
};

const hashPassword = (password) => {
     return bcryptjs.hashSync(password)
}

module.exports = { 
    authenticateUser,
    checkUserValidationChain,
    validationResult,
    handleSequelizaValidation,
    models,
    hashPassword
}