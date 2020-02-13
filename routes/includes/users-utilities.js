const { 
    authenticateUser,
    models,
    bcryptjs} = require('./common');

const { check, validationResult } = require('express-validator');

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
     return bcryptjs.hashSync(password);
}

module.exports = { 
    authenticateUser,
    checkUserValidationChain,
    validationResult,
    models,
    hashPassword
}