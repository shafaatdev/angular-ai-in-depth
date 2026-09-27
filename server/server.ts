import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { getChatConversation } from './routes/get-chat-conversation.route';
import { getChatHistory } from './routes/get-chat-history.route';
import { getRoot } from './routes/root.route';

const app = express();
const logger = pino();
const port = Number(process.env.PORT ?? 9000);

app.use(pinoHttp({ logger }));
app.get('/', getRoot);
app.get('/api/get-chat-history', getChatHistory);
app.get('/api/get-chat-conversation/:id', getChatConversation);

app.listen(port, () => {
  logger.info({ port }, 'Server listening');
});