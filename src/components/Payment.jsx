import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Payment() {
  const location = useLocation();
  const { totalPrice } = location.state; // Get the totalPrice from state

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    // Create an order on your server and get the order_id
    const result = await fetch('https://foodcrave.onrender.com/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: totalPrice }),
    });

    const orderData = await result.json();

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID
      amount: orderData.amount, // Amount is in currency subunits. Default currency is INR.
      currency: 'INR',
      name: 'Your Business Name',
      description: 'Test Transaction',
      image: 'https://example.com/your_logo', // Optional: Your logo
      order_id: orderData.id, // This is the order_id created in the backend.
      handler: async function (response) {
        alert(`Payment ID: ${response.razorpay_payment_id}`);
        alert(`Order ID: ${response.razorpay_order_id}`);
        alert(`Razorpay Signature: ${response.razorpay_signature}`);

        // Verify the payment signature
        const verify = await fetch('http://localhost:4000/api/verify-signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verificationResponse = await verify.json();
        if (verificationResponse.status === 'success') {
          // Handle successful payment verification
          alert('Payment successful and verified!');
        } else {
          alert('Payment verification failed!');
        }
      },
      prefill: {
        name: 'Your Name',
        email: 'your.email@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#F37254',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <p>Total Price to be paid: ₹{totalPrice}/-</p>
      <button onClick={handlePayment} className="btn btn-primary">Pay Now</button>
    </div>
  );
}
