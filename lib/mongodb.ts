import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
let client: MongoClient | undefined;

if (!uri) {
  throw new Error("Add Mongo URI to .env.local");
}

export async function connect() {
  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 10,
    });

    await client.connect();
  }

  return client;
}

export async function getClient() {
  if (!client) {
    throw new Error("MongoDB client is not initialized");
  }

  return client;
}
