const express = require('express');
const passport = require('passport');

const { register, login, googleSuccess, getMe, registerValidators, loginValidators } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const defaultClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

function resolveClientUrl(value) {
  try {
    const fallback = new URL(defaultClientUrl).origin;
    if (!value) return fallback;

    const url = new URL(value);
    if (process.env.NODE_ENV !== 'production' && url.hostname === 'localhost') {
      return url.origin;
    }

    return url.origin === fallback ? url.origin : fallback;
  } catch {
    return new URL(defaultClientUrl).origin;
  }
}

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.get('/me', authMiddleware, getMe);

router.get('/google', (req, res, next) => {
  const clientUrl = resolveClientUrl(req.query.redirect || req.query.redirect_uri);
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID || '');
  googleAuthUrl.searchParams.set('redirect_uri', process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback');
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'profile email');
  googleAuthUrl.searchParams.set('state', clientUrl);

  return res.redirect(googleAuthUrl.toString());
});

router.get('/google/callback', (req, res, next) => {
  const clientUrl = resolveClientUrl(req.query.state);

  return passport.authenticate('google', { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${clientUrl}/login?oauth=failed`);
    }

    req.user = user;
    req.oauthClientUrl = clientUrl;
    return googleSuccess(req, res, next);
  })(req, res, next);
});

module.exports = router;

