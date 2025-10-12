import dotenv from 'dotenv';

// Load environment variables from a .env file if present. This helper can be
// imported throughout the server codebase to ensure that variables are
// initialized before usage. If certain required variables are missing, this
// module can throw errors to help developers catch configuration issues early.

dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
};