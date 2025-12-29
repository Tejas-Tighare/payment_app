import express from "express";
import connectDB from "./db.js";
import mainRouter from "./route/index.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/v1", mainRouter);

const startServer = async () => {
  try {
    await connectDB();  
    app.listen(process.env.PORT, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error("Server failed to start", error);
  }
};

startServer();
