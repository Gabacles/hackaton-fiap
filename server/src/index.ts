import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env';
import authRoutes from './routes/auth.routes';
import activityRoutes from './routes/activities.routes';
import resourceRoutes from './routes/resources.routes';

// Create the Express application. Middlewares are applied in the order
// defined below. The server listens on the configured port and logs a
// message when ready. No database connection is established here; Prisma
// manages connections on demand via services.
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/resources', resourceRoutes);

// Simple health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});