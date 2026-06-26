// src/utils/db.ts
import { MongoClient, Db } from "mongodb";
import logger from "./logger";

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/trustlens";
let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) return db;

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db();
    logger.info("Connected to MongoDB successfully");
    return db;
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error);
    throw error;
  }
}

export async function saveAnalysisResult(rawText: string, results: any) {
  try {
    const database = await connectToDatabase();
    const collection = database.collection("analyses");
    const doc = {
      rawText,
      results,
      analyzedAt: new Date(),
    };
    const result = await collection.insertOne(doc);
    logger.info("Saved analysis result to MongoDB", result.insertedId);
    return result;
  } catch (error) {
    logger.error("Error saving analysis result to MongoDB", error);
    throw error;
  }
}
