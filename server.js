const express = require('express');
const bodyParser = require('body-parser');
const ordersRouter = require('./routes/orders');

const app = express();
app.use(bodyParser.json());
app.use('/api/orders', ordersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
