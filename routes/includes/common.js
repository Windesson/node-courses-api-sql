const models = require('../../db').models;
const {User, Course} = models;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

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

const handleSequelizaValidation = async (callback) =>{
    let errors = "";
    try {
        await callback();      
    } catch (error) {

      if (error.name === 'SequelizeValidationError' ||  error.name === 'SequelizeUniqueConstraintError') {
        errors = error.errors.map(err => err.message);
      } 

    } finally {
        return errors;
    }
};


module.exports = { 
    authenticateUser,
    handleSequelizaValidation,
    models,
    bcryptjs
}