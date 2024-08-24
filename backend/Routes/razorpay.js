const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: 'rzp_test_KTSDViCUboCjHe',
    key_secret: 'sF0FUb9SufJBb80qJtEIajTB'
});

router.post('/create-order', async (req, res) => {
    const { amount } = req.body;

    try {
        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paisa for INR)
            currency: "INR",
            receipt: crypto.randomBytes(10).toString('hex')
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).send("Some error occured");
        }

        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/verify-signature', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const shasum = crypto.createHmac('sha256', 'sF0FUb9SufJBb80qJtEIajTB');
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        res.json({ status: 'success' });
    } else {
        res.json({ status: 'failure' });
    }
});

module.exports = router;
