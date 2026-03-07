const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');

const { configurePassport } = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { errorMiddleware } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (curl, server-to-server) and local dev.
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === 'production') {
      const allowed = process.env.CLIENT_URL;
      return callback(null, Boolean(allowed && origin === allowed));
    }

    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

configurePassport();
app.use(passport.initialize());

app.get('/api/health', (req, res) => res.json({ success: true, message: 'OK' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Not found' }));
app.use(errorMiddleware);

async function start() {
  const port = process.env.PORT || 5000;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw Object.assign(new Error('Missing MONGO_URI'), { statusCode: 500 });
  }
  if (!process.env.JWT_SECRET) {
    throw Object.assign(new Error('Missing JWT_SECRET'), { statusCode: 500 });
  }

  await mongoose.connect(mongoUri);
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

