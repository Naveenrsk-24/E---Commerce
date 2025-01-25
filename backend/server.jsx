const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_WEljFUBeBGhZal', // Replace with your Razorpay key ID
  key_secret: 'hZMJSDkUJw8ittA5BzSpyB5e', // Replace with your Razorpay key secret
});

// Create an order
app.post('/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;

  const options = {
    amount: amount * 100, // Amount in smallest currency unit (e.g., paise for INR)
    currency,
    receipt,
    payment_capture: 1, // Auto-capture payment
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');   
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});