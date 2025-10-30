const express = require('express');
const router = express.Router();

// Sample GET route
router.get('/', (req, res, next) => {
  try {
    res.json({ message: 'List of pizza orders' });
  } catch (err) {
    next(err); // Pass errors to global handler
  }
});

// Sample POST route
router.post('/', (req, res, next) => {
  try {
    const { pizzaType, quantity } = req.body;
    if (!pizzaType || !quantity) {
      return res.status(400).json({ error: 'Missing pizzaType or quantity' });
    }
    res.status(201).json({ message: 'Order created successfully', order: { pizzaType, quantity } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
