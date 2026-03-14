const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');

const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function validationErrorResponse(res, errors) {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
}

const registerValidators = [
  body('name').optional().isString().withMessage('invalid name'),
  body('email').trim().isEmail().withMessage('invalid email'),
  body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
];

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return validationErrorResponse(res, errors);

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      password: hashed,
      provider: 'local',
    });

    const token = signToken(user);
    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return next(err);
  }
}

const loginValidators = [
  body('email').trim().isEmail().withMessage('invalid email'),
  body('password').notEmpty().withMessage('password is required'),
];

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return validationErrorResponse(res, errors);

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return next(err);
  }
}

function googleSuccess(req, res) {
  const user = req.user;
  const token = signToken(user);

  const clientUrl = req.oauthClientUrl || process.env.CLIENT_URL || 'http://localhost:5173';
  const redirectUrl = new URL('/oauth-success', clientUrl);
  redirectUrl.searchParams.set('token', token);

  return res.redirect(redirectUrl.toString());
}

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
  googleSuccess,
  getMe,
  registerValidators,
  loginValidators,
};

