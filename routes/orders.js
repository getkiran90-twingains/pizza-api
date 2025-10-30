const express = require('express');
const { v4: uuid } = require('uuid');
const router = express.Router();

// In-memory "DB"
let orders = [];

// Validation helper
function validateOrder(body) {
  const allowedSizes = ['small', 'medium', 'large'];
  const size = String(body.size || '').toLowerCase();

  if (!body.customerName || typeof body.customerName !== 'string' || !body.customerName.trim()) {
    return 'customerName is required (non-empty string).';
  }
  if (!allowedSizes.includes(size)) {
    return 'size must be one of: small, medium, large.';
  }
  if (!Number.isInteger(body.quantity) || body.quantity < 1) {
    return 'quantity must be a positive integer.';
  }
  if (body.toppings !== undefined) {
    if (!Array.isArray(body.toppings)) return 'toppings must be an array of strings.';
    const allStrings = body.toppings.every(t => typeof t === 'string' && t.trim());
    if (!allStrings) return 'each topping must be a non-empty string.';
    if (body.toppings.length > 20) return 'too many toppings.';
  }
  return null;
}

// CREATE
router.post('/', (req, res) => {
  const error = validateOrder(req.body);
  if (error) return res.status(400).json({ message: error });

  const order = {
    id: uuid(),
    customerName: req.body.customerName.trim(),
    size: String(req.body.size).toLowerCase(),
    toppings: req.body.toppings || [],
    quantity: req.body.quantity,
    status: 'Pending'
  };
  orders.push(order);
  return res.status(201).json(order);
});

// READ (all)
router.get('/', (req, res) => res.status(200).json(orders));

// READ (one)
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  return res.status(200).json(order);
});

// UPDATE (full replace semantics but we merge safely)
router.put('/:id', (req, res) => {
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Order not found' });

  // Merge + revalidate
  const merged = { ...orders[idx], ...req.body };
  const error = validateOrder(merged);
  if (error) return res.status(400).json({ message: error });

  orders[idx] = merged;
  return res.status(200).json(orders[idx]);
});

// DELETE
router.delete('/:id', (req, res) => {
  const existed = orders.some(o => o.id === req.params.id);
  orders = orders.filter(o => o.id !== req.params.id);
  if (!existed) return res.status(404).json({ message: 'Order not found' });
  return res.status(204).send();
});

// COMPLETE (calculate price, remove from store, return summary)
router.post('/:id/complete', (req, res) => {
  const idx = orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Order not found' });

  const order = orders[idx];
  const basePrice = { small: 8, medium: 10, large: 12 }[order.size];
  const toppingsCost = (order.toppings?.length || 0) * 1.5;
  const total = (basePrice + toppingsCost) * order.quantity;

  // Remove order to simulate completion/fulfillment
  orders.splice(idx, 1);

  return res.status(200).json({
    message: 'Order completed',
    summary: { ...order, totalPrice: Number(total.toFixed(2)) }
  });
});

module.exports = router;
