import { RequestHandler } from 'express';

export const getRoot: RequestHandler = (_request, response) => {
  response.type('html').send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Angular AI Server</title>
  </head>
  <body>
    <main>
      <h1>Server is running</h1>
      <p>The Angular AI development server is ready.</p>
    </main>
  </body>
</html>`);
};