import React, { useState } from "react";
import axios from "axios";

interface CryptoCompareResponse {
  [token: string]: {
    [date: string]: number;
  };
}

const API_BASE_URL = "http://localhost:3001";

function App() {
  const [portfolioValue, setPortfolioValue] = useState<CryptoCompareResponse>(
    {}
  );

  const fetchLatestPortfolioValuePerToken = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/portfolio-value-per-token`
    );
    setPortfolioValue(response.data);
  };

  const fetchLatestPortfolioValueForToken = async (token: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/portfolio-value-per-token/${token}`
    );
    setPortfolioValue(response.data);
  };

  const fetchPortfolioValueForTokenOnDate = async (
    token: string,
    date: Date
  ) => {
    const response = await axios.get(
      `${API_BASE_URL}/portfolio-value-per-token/${token}/${date}`
    );
    setPortfolioValue(response.data);
  };

  const fetchPortfolioValueOnDate = async (date: number) => {
    const response = await axios.get(`${API_BASE_URL}/portfolio-value/${date}`);
    setPortfolioValue(response.data);
  };

  return (
    <div className="container mx-auto my-8">
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          onClick={() => fetchLatestPortfolioValuePerToken()}
        >
          Latest Portfolio Value
        </button>
        <input
          type="text"
          placeholder="Token"
          className="border border-gray-400 p-2 rounded mr-4"
          onChange={(event) =>
            fetchLatestPortfolioValueForToken(event.target.value)
          }
        />
        <input
          type="date"
          placeholder="Date"
          className="border border-gray-400 p-2 rounded mr-4"
          onChange={(event) =>
            fetchPortfolioValueForTokenOnDate("BTC", event.target.value)
          }
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => fetchPortfolioValueOnDate(1645824000)}
        >
          Portfolio Value on Date
        </button>
      </div>
      <div className="flex justify-center">
        <div className="w-1/2">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Token</th>
                <th className="px-4 py-2">Value (USD)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(portfolioValue).map(([token, value]) => (
                <tr key={token}>
                  <td className="border px-4 py-2">{token}</td>
                  <td className="border px-4 py-2">
                    {Object.values(value)[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
