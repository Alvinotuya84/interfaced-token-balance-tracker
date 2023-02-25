import express, { Request, Response } from 'express';
import * as cryptoCompare from './cryptoCompare.js';
import  cors from 'cors';
import * as dotenv from 'dotenv'
dotenv.config()
const app = express();

app.use(express.json());
app.use(cors())
app.get('/portfolio-value-per-token', async (_req: Request, res: Response) => {
  const value = await cryptoCompare.getLatestPortfolioValuePerToken();
  res.json(value);
});

app.get('/portfolio-value-per-token/:token', async (req: Request, res: Response) => {
  const token = req.params.token;
  const value = await cryptoCompare.getLatestPortfolioValueForToken(token);
  res.json(value);
});

app.get('/portfolio-value-per-token/:token/:date', async (req: Request, res: Response) => {
  const token = req.params.token;
  const date = parseInt(req.params.date);
  const value = await cryptoCompare.getPortfolioValueForTokenOnDate(token, date);
  res.json(value);
});

app.get('/portfolio-value/:date', async (req: Request, res: Response) => {
  const date = parseInt(req.params.date);
  const value = await cryptoCompare.getPortfolioValueOnDate(date);
  res.json(value);
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
