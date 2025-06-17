import { MongoClient } from 'mongodb';

if (process.env['MONGODB_URI'] === undefined) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env['MONGODB_URI'];
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Preserve connection during hot reload in development
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Create new connection in production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export module-scoped client for shared database access
export default clientPromise;
