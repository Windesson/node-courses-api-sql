const { 
    authenticateUser,
    models,
    handleSequelizaValidation,
} = require('./common');

const { check, validationResult } = require('express-validator');
const { User } = models;

const checkCourseValidationChain = [
    check('title').exists({ checkNull: true, checkFalsy: true }).
    withMessage('Please provide a value for "title"'),
  
    check('description').exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"')
 ];
  
const filteredUserAttributes = {
    include: [ { model: User,  attributes: ["id","firstName","lastName"] } ]
};

module.exports = {
  filteredUserAttributes,
  handleSequelizaValidation,
  checkCourseValidationChain,
  authenticateUser,
  validationResult,
  models
}