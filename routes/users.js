const express = require('express');
const router = express.Router();

const {
  authenticateUser, 
  validationResult, 
  checkUserValidationChain, 
  handleSequelizaValidation, 
  models, 
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

  const user = req.body;
  user.password = hashPassword(user.password);

  const sequeliErrors = await handleSequelizaValidation( async () => {
    await User.create(user);
  });

  if(sequeliErrors) res.status(400).json({ message: sequeliErrors});

  res.status(201).end();
});


module.exports = router;