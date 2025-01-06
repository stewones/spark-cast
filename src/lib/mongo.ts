import { MongoClient } from 'mongodb';

const mongoURI = process.env["MONGO_URI"]!;
const isProduction = !mongoURI.includes("localhost");

const client = new MongoClient(mongoURI);

export { client, isProduction };
