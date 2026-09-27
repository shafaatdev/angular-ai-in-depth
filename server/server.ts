import 'dotenv/config';
import express from 'express';
import pinoHttp from 'pino-http';
import { continueConversation } from './routes/continue-conversation.route';
import { getChatConversation } from './routes/get-chat-conversation.route';
import { getChatHistory } from './routes/get-chat-history.route';
import { getRoot } from './routes/root.route';
import { startConversation } from './routes/start-conversation.route';
import { logger } from './logger';
import { errorHandler } from './middleware/error-handler.middleware';

const app = express();
const port = Number(process.env.PORT ?? 9000);

app.use(pinoHttp({
  logger,
  customLogLevel: (_request, response, error) => {
    if (error || response.statusCode >= 500) return 'error';
    if (response.statusCode >= 400) return 'warn';
    return 'info';
  }
}));
app.use(express.json({ limit: '16kb' }));
app.get('/', getRoot);
app.get('/api/get-chat-history', getChatHistory);
app.get('/api/get-chat-conversation/:id', getChatConversation);
app.post('/api/start-conversation', startConversation);
app.post('/api/continue-conversation', continueConversation);
app.use(errorHandler);

app.listen(port, () => {
  logger.info({ port }, 'Server listening');
});