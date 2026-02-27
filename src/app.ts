import express from 'express';

const app = express();
app.disable('x-powered-by');

// Middleware global
app.use(express.json());

export default app;
