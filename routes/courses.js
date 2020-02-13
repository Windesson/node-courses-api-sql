const express = require('express');
const router = express.Router();

const { 
   filteredUserAttributes, 
   validationResult, 
   checkCourseValidationChain,
   authenticateUser,
   models
  } = require('./includes/courses-utilities')

const {Course} = models;

const handleErrorMessage = (error) => {
  if (error.name === 'SequelizeValidationError' || error.name === "SequelizeUniqueConstraintError") {
   return error.errors.map(err => err.message);
 } 
 return { "error": error.name, "message": error.message};
}


// Returns a list of courses 
router.get('/', async (req, res) => {    
  try {
    const courses = await Course.findAll(filteredUserAttributes)
    res.status(200).json(courses);    
  } catch (error) {
    const message = handleErrorMessage(error);
    res.status(400).json({ errors: message });
  }

});

// Returns a course by id
router.get('/:id', async (req, res, next) => { 
  try {
    const courses = await Course.findByPk(req.params.id, filteredUserAttributes)
    if(courses)
      res.status(200).json(courses);
    else
      next();
  } catch (error) {
    const message = handleErrorMessage(error);
    res.status(400).json({ errors: message });
  } 
});

// Route that creates a new course.
router.post('/', [authenticateUser, checkCourseValidationChain], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  }
  try {
    const course = await Course.create(req.body);
    res.location(`${req.originalUrl}/${course.id}`).status(201).end();
  } catch (error) {
    const message = handleErrorMessage(error);
    res.status(400).json({ errors: message });
  }

});

// Updates a course and returns no content
router.put("/:id", [authenticateUser, checkCourseValidationChain],async (req, res, next) => {  
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  }

  try {
    course = await Course.findByPk(req.params.id);
    if(course){
      await course.update(req.body);
      res.status(204).end();
    } else {
      next(); 
    }
  } catch (error) {
    const message = handleErrorMessage(error);
    res.status(400).json({ errors: message });
  }
});

//Deletes a course and returns no content
router.delete("/:id", authenticateUser, async (req, res, next) => {  

    try {
      const course = await Course.findByPk(req.params.id);
      if(course){      
        await course.destroy();      
        res.status(204).end();      
      } else {
        next(); 
      } 
    } catch (error) {
      const message = handleErrorMessage(error);
      res.status(400).json({ errors: message });
    } 
});

module.exports = router;