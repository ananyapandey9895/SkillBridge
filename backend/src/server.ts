import 'dotenv/config';
import app from './app';
import { PrismaConnection } from './config/prisma';

const PORT = process.env.PORT ?? 3000;

async function bootstrap(): Promise<void> {
  await PrismaConnection.connect();
  console.log('[DB] Prisma connected');
  app.listen(PORT, () => console.log(`[Server] Listening on port ${PORT}`));
}

bootstrap().catch((err) => {
  console.error('[Bootstrap error]', err);
  process.exit(1);
});
