const express = require('express');
const { v4: uuid } = require('uuid');
const router = express.Router();

let orders = [];

// Add new order
router.post('/', (req, res) => {
  const { customerName, size, toppings, quantity } = req.body;
  if (!customerName || !size || !quantity)
    return res.status(400).json({ message: 'Missing information' });

  const newOrder = {
    id: uuid(),
    customerName,
    size,
    toppings: toppings || [],
    quantity,
    status: 'Pending'
  };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Get all orders
router.get('/', (req, res) => res.json(orders));

// Get one order
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// Update order
router.put('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  Object.assign(order, req.body);
  res.json(order);
});

// Delete order
router.delete('/:id', (req, res) => {
  orders = orders.filter(o => o.id !== req.params.id);
  res.json({ message: 'Order deleted' });
});

// Complete order
router.post('/:id/complete', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const priceList = { small: 8, medium: 10, large: 12 };
  const toppingCost = 1.5 * (order.toppings?.length || 0);
  const total = (priceList[order.size] + toppingCost) * order.quantity;

  orders = orders.filter(o => o.id !== req.params.id);
  res.json({
    message: 'Order completed',
    summary: { ...order, totalPrice: `$${total}` }
  });
});

module.exports = router;
