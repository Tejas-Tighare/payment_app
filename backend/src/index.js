import express from "express";
import connectDB from "./db.js";
import { User } from "./models/user.js";
import mainRouter from "./route/index.js"

const app = express();

app.use(express.json());


 

connectDB();

app.use("/api/v1", mainRouter);

