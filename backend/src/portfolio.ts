import axios from 'axios';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./files/transactions.db');

const CRYPTOCOMPARE_BASE_URL = 'https://min-api.cryptocompare.com/data';

async function getExchangeRate(token: string): Promise<number> {
  const response = await axios.get(`${CRYPTOCOMPARE_BASE_URL}/price?fsym=${token}&tsyms=USD`);
  return response.data.USD;
}

async function getPortfolioValueForDate(date: Date, token?: string): Promise<number> {
  const timestamp = Math.floor(date.getTime() / 1000);
  let query = `SELECT token, SUM(CASE WHEN transaction_type = 'DEPOSIT' THEN amount ELSE -amount END) AS balance FROM transactions WHERE timestamp <= ${timestamp} GROUP BY token`;

  if (token) {
    query += ` HAVING token = '${token}'`;
  }

  return new Promise((resolve, reject) => {
    db.all(query, async (err, rows) => {
      if (err) {
        reject(err);
      } else {
        let totalValue = 0;

        for (const row of rows) {
          const exchangeRate = await getExchangeRate(row.token);
          const value = row.balance * exchangeRate;
          totalValue += value;
        }

        resolve(totalValue);
      }
    });
  });
}

async function getLatestPortfolioValueForToken(token: string): Promise<number> {
  const date = new Date();
  return getPortfolioValueForDate(date, token);
}

async function getLatestPortfolioValue(): Promise<Map<string, number>> {
  const date = new Date();
  const portfolioValueMap = new Map<string, number>();
  const query = `SELECT token, SUM(CASE WHEN transaction_type = 'DEPOSIT' THEN amount ELSE -amount END) AS balance FROM transactions WHERE timestamp <= ${Math.floor(date.getTime() / 1000)} GROUP BY token`;

  return new Promise((resolve, reject) => {
    db.all(query, async (err, rows) => {
      if (err) {
        reject(err);
      } else {
        for (const row of rows) {
          const exchangeRate = await getExchangeRate(row.token);
          const value = row.balance * exchangeRate;
          portfolioValueMap.set(row.token, value);
        }

        resolve(portfolioValueMap);
      }
    });
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    const portfolioValueMap = await getLatestPortfolioValue();
    console.log('Latest portfolio value per token in USD:');
    for (const [token, value] of portfolioValueMap.entries()) {
      console.log(`${token}: ${value}`);
    }
  } else if (args.length === 1) {
    const token = args[0];
    const value = await getLatestPortfolioValueForToken(token);
    console.log(`Latest portfolio value for ${token} in USD: ${value}`);
  } else if (args.length === 2
    ) {
        const date = new Date(args[0]);
          const token = args[1];
        const value = await getPortfolioValueForDate(date, token);
        console.log(`Portfolio value for ${token} on ${date.toISOString()} in USD: ${value}`);
        } else if (args.length === 3) {
        const date = new Date(args[0]);
          const token = args[1];
          const value = await getPortfolioValueForDate(date, token);
        console.log(`Portfolio value for ${token} on ${date.toISOString()} in USD: ${value}`);
        } else {
        console.log('Invalid arguments');
        }

        db.close();
        }

        main();