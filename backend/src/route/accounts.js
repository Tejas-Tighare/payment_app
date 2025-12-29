import express from "express";
import mongoose from "mongoose";
import { Account } from "../models/account.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

//balance checking route

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.userId });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// mmoney transfer route

router.post("/transfer", authMiddleware, async (req, res) => {
  const { amount, to } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const session = await mongoose.startSession();  // =create session

  try {
    session.startTransaction();  // start session

    const sender = await Account.findOne({ userId: req.userId }).session(session);
    const receiver = await Account.findOne({ userId: to }).session(session);

    if (!sender || !receiver) {
      throw new Error("Account not found");
    }

    if (sender.balance < amount) {
      throw new Error("Insufficient balance");
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();  //end session here so no partially query are excute.

    res.json({
      message: "Transfer successful",
      balance: sender.balance
    });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
});

export default router;
