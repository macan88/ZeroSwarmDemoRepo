const request = require('supertest');
const { app, calculateDiscount, calculateFinalPrice } = require('../src/index');

describe('Discount Calculator', () => {
  describe('calculateDiscount', () => {
    test('should return 10% discount for orders >= $100', () => {
      expect(calculateDiscount(100)).toBe(10);
      expect(calculateDiscount(150)).toBe(15);
      expect(calculateDiscount(200)).toBe(20);
    });

    test('should return 5% discount for orders >= $50 and < $100', () => {
      expect(calculateDiscount(50)).toBe(2.5);
      expect(calculateDiscount(75)).toBe(3.75);
      expect(calculateDiscount(99)).toBe(4.95);
    });

    test('should return 0 discount for orders < $50', () => {
      expect(calculateDiscount(0)).toBe(0);
      expect(calculateDiscount(25)).toBe(0);
      expect(calculateDiscount(49.99)).toBe(0);
    });
  });

  describe('calculateFinalPrice', () => {
    test('should subtract 10% discount for orders >= $100', () => {
      // $100 - $10 discount = $90
      expect(calculateFinalPrice(100)).toBe(90);
      // $200 - $20 discount = $180
      expect(calculateFinalPrice(200)).toBe(180);
    });

    test('should subtract 5% discount for orders >= $50', () => {
      // $50 - $2.50 discount = $47.50
      expect(calculateFinalPrice(50)).toBe(47.5);
      // $80 - $4 discount = $76
      expect(calculateFinalPrice(80)).toBe(76);
    });

    test('should return original price for orders < $50', () => {
      expect(calculateFinalPrice(25)).toBe(25);
      expect(calculateFinalPrice(0)).toBe(0);
    });
  });
});

describe('API Endpoints', () => {
  describe('GET /health', () => {
    test('should return ok status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('POST /calculate-price', () => {
    test('should calculate correct final price with 10% discount', async () => {
      const response = await request(app)
        .post('/calculate-price')
        .send({ cartTotal: 100 });

      expect(response.status).toBe(200);
      expect(response.body.cartTotal).toBe(100);
      expect(response.body.discount).toBe(10);
      expect(response.body.finalPrice).toBe(90); // This will FAIL due to bug
    });

    test('should calculate correct final price with 5% discount', async () => {
      const response = await request(app)
        .post('/calculate-price')
        .send({ cartTotal: 60 });

      expect(response.status).toBe(200);
      expect(response.body.cartTotal).toBe(60);
      expect(response.body.discount).toBe(3);
      expect(response.body.finalPrice).toBe(57); // This will FAIL due to bug
    });

    test('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/calculate-price')
        .send({ cartTotal: -10 });

      expect(response.status).toBe(400);
    });
  });
});
