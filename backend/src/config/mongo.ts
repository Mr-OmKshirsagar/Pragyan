export function getMongoUrl(): string {
  const mongoUrl = process.env.DATABASE_URL;

  if (!mongoUrl) {
    throw new Error('DATABASE_URL is required and must point to MongoDB Atlas');
  }

  return mongoUrl;
}
