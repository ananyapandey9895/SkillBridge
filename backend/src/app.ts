import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes';
import sessionRoutes from './routes/session.routes';
import skillRoutes from './routes/skill.routes';
import skillRequestRoutes from './routes/skillRequest.routes';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/requests', skillRequestRoutes);
app.use('/api/sessions', sessionRoutes);

export default app;
