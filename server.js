const express = require('express');
const app = express();
const ordersRoute = require('./routes/orders');

app.use(express.json());

// Routes
app.use('/orders', ordersRoute);

// 404 handler (route not found)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
