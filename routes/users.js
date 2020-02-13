const express = require('express');
const router = express.Router();

const {
  authenticateUser, 
  validationResult, 
  checkUserValidationChain,  
  models, handleErrorMessage,
  hashPassword} = require("./includes/users-utilities");

const User = models.User;

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
    return res.status(400).json({ errors: errorMessages });
  }

  let user = req.body;
  user.password = hashPassword(user.password);
  try {
    user = await User.create(user);
    return res.location(`${req.originalUrl}/${user.id}`).status(201).end();
  } catch (error) {
    const message = handleErrorMessage(error);
    return res.status(400).json({ errors: message });
  }
});


module.exports = router;