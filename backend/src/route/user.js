import express from "express";
import { z } from "zod";
import { User } from "../models/user.js";
import { Account } from "../models/account.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authMiddleware from "../middleware/auth.js";




dotenv.config();

const router = express.Router();

const signupSchema = z.object({
  username: z.string().min(3),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  password: z.string().min(6),
});

router.post("/signup", async (req, res) => {
  try {
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: result.error.errors,
      });
    }

    const { username, firstname, lastname, password } = result.data;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      firstname,
      lastname,
      password: hashedPassword,
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

const signinSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

router.post("/signin", async (req, res) => {
  try {
    const parsed = signinSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.errors,
      });
    }

    const { username, password } = parsed.data;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


const updateSchema = z.object({
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
}).strict();



router.put("/update", authMiddleware, async (req, res) => {
  try {
    const parsed = updateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.errors
      });
    }

    const data = parsed.data;

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: data },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});


router.get("/bulk",authMiddleware, async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        { firstname: { $regex: filter, $options: "i" } },
        { lastname: { $regex: filter, $options: "i" } }
      ]
    }).select("firstname lastname username");;

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});








export default router;
