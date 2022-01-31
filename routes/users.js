const express = require("express")
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const config = require("config");
const { body, validationResult } = require('express-validator');

const User = require('../models/User');

// @route POST api/users
// @des Register a user
// @access Public
router.post('/', [
  body('name', 'Please add a name')
    .not()
    .isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })
], 
async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // res.send("Passed!!!");
  const { name, email, password } = req.body;
  
  try {
    let user = await User.findOne({ email });

    if(user) {
      return res.status(400).json({ msg: "User Already Exists" });
    }

    user = new User({
      name,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // res.send('User Saved!!!')
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload,
      config.get('jswSecret'),
      {
        expiresIn: 360000
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).send( "Server Error");
  }

});

module.exports = router;