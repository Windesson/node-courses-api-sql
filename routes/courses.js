const express = require('express');
const router = express.Router();

const db = require('../db');
const Course = db.models.Course;
const { Op } = db.Sequelize;

// Route that returns the current authenticated user.
router.get('/', async (req, res) => {    
    const courses = await Course.findAll();  
    res.json(courses);
  });

module.exports = router;