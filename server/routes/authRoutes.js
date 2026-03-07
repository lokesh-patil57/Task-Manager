const express = require('express');
const passport = require('passport');

const { register, login, googleSuccess, registerValidators, loginValidators } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  googleSuccess
);

module.exports = router;

