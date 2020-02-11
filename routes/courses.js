const express = require('express');
const router = express.Router();

const db = require('../db');
const models = db.models;
const { Course, User } = models;
const { check, validationResult } = require('express-validator');

// Returns a list of courses (including the course that owns each course)
router.get('/', async (req, res) => {    
    const courses = await Course.findAll({
      include: [ { model: User }, ], });
    res.json(courses);
});


// Returns a the course (including the course that owns the course) for the provided course ID
router.get('/:id', async (req, res) => {  
  const id = req.params.id;  
  const courses = await Course
  .findByPk(id , {include: [ { model: User },], });
  
  res.json(courses);
});

// Route that creates a new course.
router.post('/', [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"')
], async (req, res) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });
  }

  // Get the course from the request body.
  const course = req.body;

  // Add the course to the `users` table.
  try{
     await Course.create(course);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      error = error.errors.map(err => err.message);
    }
      return res.status(400).json({ message: error});
  }

  // Set the status to 201 Created and end the response.
  return res.status(201).end();
});

router.put("/:id", async (req, res) => {  
  const id = req.params.id;  

  try {
    course = await Course.findByPk(id);
    if(course){
      await course.update(req.body);
    } else {
      next();  // global 404 error handle
    }
    
  } catch (error){
    if (error.name === 'SequelizeValidationError') {
      errors = error.errors.map(err => err.message);
      return res.status(400).json({ message: errors});
    } else {
      throw error;
    }
  }
});

router.delete("/:id", async (req, res) => {  
  const id = req.params.id;  

  try {
    course = await Course.findByPk(id);
    if(course){
      await course.destroy();
    } else {
      next();  // global 404 error handle
    }
    
  } catch (error){
    if (error.name === 'SequelizeValidationError') {
      errors = error.errors.map(err => err.message);
      return res.status(400).json({ message: errors});
    } else {
      throw error;
    }
  }
});

module.exports = router;