'use strict';

const express = require('express');
const router = express.Router();
const { models } = require('../db');
const { Course} = models;
const { validationResult } = require('express-validator');

const {
  authenticateUser,
  handleErrorMessage,
  filteredUserAttributes,
  checkCourseValidationChain,
} = require("./includes/utilities");


// Returns a list of courses 
router.get('/', async (req, res) => {    
  try {
    const courses = await Course.findAll(filteredUserAttributes)
    return res.status(200).json(courses);    
  } catch (error) {
    const message = handleErrorMessage(error);
    return res.status(400).json({ errors: message });
  }

});

// Returns a course by id
router.get('/:id', async (req, res, next) => { 
  try {
    const courses = await Course.findByPk(req.params.id, filteredUserAttributes)
    if(courses)
    return res.status(200).json(courses);
    else
      next();
  } catch (error) {
    const message = handleErrorMessage(error);
    return res.status(400).json({ errors: message });
  } 
});

// Route that creates a new course.
router.post('/', [authenticateUser, checkCourseValidationChain], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  try {
    const course = await Course.create(req.body);
    return res.location(`${req.originalUrl}/${course.id}`).status(201).end();
  } catch (error) {
    const message = handleErrorMessage(error);
    return res.status(400).json({ errors: message });
  }

});

// Updates a course and returns no content
router.put("/:id", [authenticateUser, checkCourseValidationChain],async (req, res, next) => {  
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }

  try {
    let course = await Course.findByPk(req.params.id);
    if(course){
      const user = req.currentUser;
      if(user.id !== course.userId) return res.status(403).json({ errors: "User doesn't own the requested course" });
      await course.update(req.body);
      return res.status(204).end();
    } else {
      next(); 
    }
  } catch (error) {
    const message = handleErrorMessage(error);
    return res.status(400).json({ errors: message });
  }
});

//Deletes a course and returns no content
router.delete("/:id", authenticateUser, async (req, res, next) => {  

    try {
      const course = await Course.findByPk(req.params.id);
      if(course){      
        const user = req.currentUser;
        if(user.id !== course.userId) return res.status(403).json({ errors: "User doesn't own the requested course" });
        await course.destroy();      
        return res.status(204).end();      
      } else {
        next(); 
      } 
    } catch (error) {
      const message = handleErrorMessage(error);
      return res.status(400).json({ errors: message });
    } 
});

module.exports = router;
