'use client';
import { useState } from 'react';
import axios from 'axios';
import Script from 'next/script';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(''); // User enters the amount

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setLoading(true);

    try {
      // Create an order on the backend
      const response = await axios.post('http://localhost:5000/create-order', {
        amount: Number(amount), // Convert to number
        currency: 'INR', // Static currency (can be dynamic if needed)
        receipt: `receipt_${Math.random().toString(36).substring(7)}`, // Random receipt
      });

      const order = response.data;

      // Razorpay checkout options
      const options = {
        key: 'rzp_test_WEljFUBeBGhZal', // Replace with your Razorpay key ID
        amount: order.amount,
        currency: order.currency,
        name: 'Naveen Kumar',
        description: 'Test Transaction',
        order_id: order.id,
        handler: function (response) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: 'John Doe', // Static name (can be dynamic if needed)
          email: 'john.doe@example.com', // Static email (can be dynamic if needed)
          contact: '8608980781', // Static contact (can be dynamic if needed)
        },
        theme: {
          color: '#3399cc',
        },
      };

      // Open Razorpay payment modal
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Razorpay Payment Gateway</h1>

        {/* Input field for amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Amount (in INR):
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pay Now button */}
        <button
          onClick={handlePayment}
          disabled={loading || !amount}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold ${
            loading || !amount ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>

      {/* Load Razorpay script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}