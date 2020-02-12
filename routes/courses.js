const express = require('express');
const router = express.Router();

const tools = require('./includes/courses-utilities');
const {filteredUserAttributes, handleSequelizaValidation, validationResult, checkValidationChain} = tools
const {Course} = tools.models;

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
router.post('/', checkValidationChain, async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  handleSequelizaValidation( async () => {
    await Course.create(req.body);
  })

  return res.status(201).end();

});

// Updates a course and returns no content
router.put("/:id", async (req, res) => {  
  handleSequelizaValidation( async () => {
    course = await Course.findByPk(req.params.id);
    if(course){
      await course.update(req.body);
    } else {
      next(); 
    }
  })
});

router.delete("/:id", async (req, res) => {  
  handleSequelizaValidation( async () => {
    course = await Course.findByPk(req.params.id);
    if(course){
      await course.destroy();
    } else {
      next(); 
    }
  })   
});

module.exports = router;