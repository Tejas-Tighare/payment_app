import express from "express";
import connectDB from "./db.js";
import { User } from "./models/user.js";

 

connectDB();

await User.create({
  username: "testuser",
  password: "12345678",
  firstname: "Test",
  lastname: "User"
});
