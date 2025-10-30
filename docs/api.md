# Pizza API – Endpoint Reference

## Base URL
`http://localhost:3000`

## POST /api/orders
Create order.
**Body**# Pizza API – Endpoint Reference

This document describes all the available endpoints for the Pizza Store API.  
The base URL for all requests is:

```
http://localhost:3000
```

---

## POST /api/orders
Purpose: Create a new pizza order.

Request Body Example:
```json
{
  "customerName": "Kiran Raj",
  "size": "large",
  "toppings": ["pepperoni", "mushroom"],
  "quantity": 2
}
```

Responses:
- 201 Created — Returns the new order.
- 400 Bad Request — Missing or invalid data.

---

## GET /api/orders
Purpose: Retrieve all current pizza orders.

Responses:
- 200 OK — Returns an array of all pizza orders.

---

## GET /api/orders/{id}
Purpose: Retrieve a single pizza order by its ID.

Responses:
- 200 OK — Returns that specific order.
- 404 Not Found — Order does not exist.

---

## PUT /api/orders/{id}
Purpose: Update an existing pizza order.

Request Body Example:
```json
{
  "quantity": 3
}
```

Responses:
- 200 OK — Returns the updated order.
- 400 Bad Request — Invalid input data.
- 404 Not Found — Order not found.

---

## DELETE /api/orders/{id}
Purpose: Delete (cancel) an existing pizza order.

Responses:
- 204 No Content — Order deleted successfully.
- 404 Not Found — Order not found.

---

## POST /api/orders/{id}/complete
Purpose: Mark an order as completed and calculate the total price.

Responses:
- 200 OK — Returns the completed order summary with total price.
- 404 Not Found — Order not found.

---

### Notes
- All endpoints accept and return JSON data.
- The API follows RESTful design principles.
- Validation ensures:
  - customerName, size, and quantity are required.
  - size must be one of: small, medium, or large.
  - quantity must be a positive number.
  - toppings (if provided) must be a list of text values.

```json
{
  "customerName": "string",
  "size": "small|medium|large",
  "toppings": ["string"],
  "quantity": 1
}
