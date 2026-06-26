// src/server.ts
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { orchestrator } from "./index";
import { connectToDatabase, saveAnalysisResult } from "./utils/db";
import logger from "./utils/logger";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});



const PORT = process.env.PORT || 5001;

// POST /api/analyze - Runs the orchestrator and saves the results to MongoDB
app.post("/api/analyze", async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'text' property in request body." });
  }

  try {
    const analysisResult = await orchestrator(text);
    
    // Save to MongoDB
    await saveAnalysisResult(text, analysisResult);

    return res.status(200).json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    logger.error("Error in /api/analyze endpoint", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /api/history - Retrieves previous scans from MongoDB
app.get("/api/history", async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("analyses");
    const history = await collection.find({}).sort({ analyzedAt: -1 }).limit(50).toArray();
    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    logger.error("Error in /api/history endpoint", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
async function startServer() {
  try {
    // Check/establish DB connection before starting Express
    await connectToDatabase();
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server due to database connection issue", error);
    process.exit(1);
  }
}

startServer();
