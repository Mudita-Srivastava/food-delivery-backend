import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
const createPaymentOrder = async (req, res) => {
  const { amount, orderId } = req.body;

  try {
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `order_rcptid_${orderId}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify and capture payment
const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
    amount,
  } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // ✅ 1. Mark order as paid
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "paid" },
    });

    // ✅ 2. Create payment record
    await prisma.payment.create({
      data: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount,
        orderId,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Payment verified and saved" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export default {createPaymentOrder,verifyPayment};
