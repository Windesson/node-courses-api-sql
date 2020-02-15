const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

const { check } = require('express-validator');
const { User }  = require('../../db').models;

/**
 * This function credited to
 * https://teamtreehouse.com/library/rest-api-authentication-with-express
 * Some modification were done.
 *  */ 
const authenticateUser = async (req, res, next) => {
    let message = null;
  
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);
  
    // If the user's credentials are available...
    if (credentials) {
      // Attempt to retrieve the user from the data store
      // by their username (i.e. the user's "key"
      // from the Authorization header).
      let user;
      try {
        user = await User.findOne({
            where: {
              emailAddress: credentials.name,
            },
          })   
      } catch (error) {
        message = handleErrorMessage(error); 
        return res.status(401).json({ message: message });
      }
  
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
      return res.status(401).json({ message: 'Access Denied' });
    } else {
      // Or if user authentication succeeded...
      // Call the next() method.
      next();
    }
};

const handleErrorMessage = (error) => {
    if (error.name === 'SequelizeValidationError' || error.name === "SequelizeUniqueConstraintError") {
     return error.errors.map(err => err.message);
   } 
     return { "error": error.name, "message": error.message};
}

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

const hashPassword = (password) => {
    try {
       return bcryptjs.hashSync(password);
    } catch (error) {
      return null;
    }  
  }

  const checkCourseValidationChain = [
    check('title').exists({ checkNull: true, checkFalsy: true }).
    withMessage('Please provide a value for "title"'),
  
    check('description').exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"')
 ];
  

const filteredUserAttributes = {
    attributes : ["id","title","description", "userId"],
    include: [  
      { 
        model: User,  attributes: ["id","firstName","lastName", "emailAddress"]
      }
    ] 
};



module.exports = { 
  authenticateUser,
  checkUserValidationChain,
  handleErrorMessage,
  hashPassword,
  filteredUserAttributes,
  checkCourseValidationChain,
}