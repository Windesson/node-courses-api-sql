const express = require('express');
const router = express.Router();

const {
  authenticateUser, 
  validationResult, 
  checkUserValidationChain,  
  models,
  hashPassword} = require("./includes/users-utilities");

const User = models.User;

const handleErrorMessage = (error) => {
  if (error.name === 'SequelizeValidationError' || error.name === "SequelizeUniqueConstraintError") {
   return error.errors.map(err => err.message);
 } 
   return { "error": error.name, "message": error.message};
}

// Route that returns the current authenticated user.
router.get('/', authenticateUser, (req, res) => {

    const user = req.currentUser;
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    });

});

// Route that creates a new user.
router.post('/', checkUserValidationChain, async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    res.status(400).json({ errors: errorMessages });
  }

  let user = req.body;
  user.password = hashPassword(user.password);
  console.log(user);
  try {
    user = await User.create(user);
    res.location(`${req.originalUrl}/${user.id}`).status(201).end();
  } catch (error) {
    const message = handleErrorMessage(error);
    res.status(400).json({ errors: message });
  }
});


module.exports = router;