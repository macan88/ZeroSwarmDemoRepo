const express = require('express');
const app = express();

app.use(express.json());

/**
 * Calculate discount based on cart total
 * - Orders >= $100: 10% discount
 * - Orders >= $50: 5% discount  
 * - Orders < $50: no discount
 */
function calculateDiscount(cartTotal) {
  if (cartTotal >= 100) {
    return cartTotal * 0.10;
  } else if (cartTotal >= 50) {
    return cartTotal * 0.05;
  }
  return 0;
}

/**
 * Calculate final price after discount
 * BUG: Adds discount instead of subtracting it!
 */
function calculateFinalPrice(cartTotal) {
  const discount = calculateDiscount(cartTotal);
  // BUG: Should be cartTotal - discount
  return cartTotal + discount;
}

// API Endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/calculate-price', (req, res) => {
  const { cartTotal } = req.body;
  
  if (typeof cartTotal !== 'number' || cartTotal < 0) {
    return res.status(400).json({ error: 'Invalid cart total' });
  }

  const discount = calculateDiscount(cartTotal);
  const finalPrice = calculateFinalPrice(cartTotal);

  res.json({
    cartTotal,
    discount,
    finalPrice
  });
});

// Export for testing
module.exports = { app, calculateDiscount, calculateFinalPrice };

// Start server if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
