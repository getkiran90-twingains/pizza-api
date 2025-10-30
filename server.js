const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const ordersRouter = require('./routes/orders');

const app = express();

// Security & hardening
app.use(helmet()); // secure HTTP headers
app.use(cors());   // allow cross-origin (adjust origin if you need to restrict)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200                   // limit each IP to 200 requests per window
}));

// Parse JSON bodies
app.use(bodyParser.json());

// Routes
app.use('/api/orders', ordersRouter);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
