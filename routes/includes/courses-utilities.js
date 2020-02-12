const { check, validationResult } = require('express-validator');
const db = require('../../db');
const models = db.models;
const { User } = models;

module.exports = {
 checkValidationChain : [
    check('title').exists({ checkNull: true, checkFalsy: true }).
    withMessage('Please provide a value for "title"'),
  
    check('description').exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"')
 ],
  
 handleSequelizaValidation: async (callback) =>{
    try {
        await callback();      
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        error = error.errors.map(err => err.message);
      } 
      return res.status(400).json({ message: error});
    }
 },
  
 filteredUserAttributes: {
    include: [ { model: User,  attributes: ["id","firstName","lastName"] } ]
 },

  validationResult,
  models
}