# ZeroSwarm Demo Repository

A simple Express.js application demonstrating a discount pricing calculator for e-commerce.

## Features

- Calculate discounts based on cart total
- REST API for price calculations
- Comprehensive test suite

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

## Testing

```bash
npm test
```

## API Endpoints

### GET /health
Health check endpoint.

### POST /calculate-price
Calculate the final price after discounts.

**Request Body:**
```json
{
  "cartTotal": 100
}
```

**Response:**
```json
{
  "cartTotal": 100,
  "discount": 10,
  "finalPrice": 90
}
```

## Discount Rules

- Orders >= $100: 10% discount
- Orders >= $50: 5% discount
- Orders < $50: No discount
