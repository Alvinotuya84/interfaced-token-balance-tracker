import axios from 'axios';

interface CryptoCompareResponse {
  [token: string]: {
    [date: string]: number;
  };
}

const API_KEY = process.env.CRYPTOCOMPARE_API_KEY;

async function getLatestPortfolioValuePerToken(): Promise<CryptoCompareResponse> {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC&tsyms=USD&api_key=${API_KEY}`);
  return response.data;
}

async function getLatestPortfolioValueForToken(token: string): Promise<CryptoCompareResponse[string]> {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${API_KEY}`);
  return { [token]: response.data };
}

async function getPortfolioValueForTokenOnDate(token: string, date: number): Promise<CryptoCompareResponse[string]> {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${token}&tsyms=USD&ts=${date}&api_key=${API_KEY}`);
  return { [token]: response.data[token].USD };
}

async function getPortfolioValueOnDate(date: number): Promise<CryptoCompareResponse> {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC&tsyms=USD&ts=${date}&api_key=${API_KEY}`);
  return response.data;
}

export {
  getLatestPortfolioValuePerToken,
  getLatestPortfolioValueForToken,
  getPortfolioValueForTokenOnDate,
  getPortfolioValueOnDate,
};
