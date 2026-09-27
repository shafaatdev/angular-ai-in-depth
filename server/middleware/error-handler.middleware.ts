import type { ErrorRequestHandler } from 'express';
import { logger } from '../logger';

export const errorHandler: ErrorRequestHandler = (error: unknown, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const errorDetails = typeof error === 'object' && error !== null
    ? error as Record<string, unknown>
    : {};
  const errorStatus = errorDetails['statusCode'] ?? errorDetails['status'];
  const statusCode = typeof errorStatus === 'number' && errorStatus >= 400 && errorStatus <= 599
    ? errorStatus
    : 500;

  logger.error(
    {
      method: request.method,
      path: request.path,
      statusCode,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorType: typeof errorDetails['type'] === 'string' ? errorDetails['type'] : undefined
    },
    'Request failed'
  );

  response.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal server error.' : 'Invalid request.'
  });
};