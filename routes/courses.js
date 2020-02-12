const express = require('express');
const router = express.Router();

const { 
   filteredUserAttributes, 
   handleSequelizaValidation, 
   validationResult, 
   checkCourseValidationChain,
   authenticateUser,
   models
  } = require('./includes/courses-utilities')

const {Course} = models;

// Returns a list of courses 
router.get('/', async (req, res) => {    
    const courses = await Course.findAll(filteredUserAttributes)
    res.json(courses);
});

// Returns a course by id
router.get('/:id', async (req, res) => {  
  const id = req.params.id;  
  const courses = await Course.findByPk(id, filteredUserAttributes);
  res.json(courses);
});

// Route that creates a new course.
router.post('/', [authenticateUser, checkCourseValidationChain], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  const sequeliErrors = await handleSequelizaValidation( async () => {
    await Course.create(req.body);
  });

  if(sequeliErrors) 
      res.status(400).json({ message: sequeliErrors});
  
  return res.status(201).end();
});

// Updates a course and returns no content
router.put("/:id", [authenticateUser, checkCourseValidationChain],async (req, res) => {  
  handleSequelizaValidation( async () => {
    course = await Course.findByPk(req.params.id);
    if(course){

      const sequeliErrors = await handleSequelizaValidation( async () => {
        await course.update(req.body);
      });
    
      if(sequeliErrors) 
         res.status(400).json({ message: sequeliErrors});
      
      res.status(204).end();

    } else {
      next(); 
    }
  })
});

//Deletes a course and returns no content
router.delete("/:id", authenticateUser, async (req, res) => {  
  handleSequelizaValidation( async () => {
    course = await Course.findByPk(req.params.id);
    if(course){

      const sequeliErrors = await handleSequelizaValidation( async () => {
         await course.destroy();
      });
    
      if(sequeliErrors) 
         res.status(400).json({ message: sequeliErrors});

      return res.status(204).end();
    } else {
      next(); 
    }
  })   
});

module.exports = router;