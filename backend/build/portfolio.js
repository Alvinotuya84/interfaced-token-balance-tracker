var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./files/transactions.db');
const CRYPTOCOMPARE_BASE_URL = 'https://min-api.cryptocompare.com/data';
function getExchangeRate(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(`${CRYPTOCOMPARE_BASE_URL}/price?fsym=${token}&tsyms=USD`);
        return response.data.USD;
    });
}
function getPortfolioValueForDate(date, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const timestamp = Math.floor(date.getTime() / 1000);
        let query = `SELECT token, SUM(CASE WHEN transaction_type = 'DEPOSIT' THEN amount ELSE -amount END) AS balance FROM transactions WHERE timestamp <= ${timestamp} GROUP BY token`;
        if (token) {
            query += ` HAVING token = '${token}'`;
        }
        return new Promise((resolve, reject) => {
            db.all(query, (err, rows) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject(err);
                }
                else {
                    let totalValue = 0;
                    for (const row of rows) {
                        const exchangeRate = yield getExchangeRate(row.token);
                        const value = row.balance * exchangeRate;
                        totalValue += value;
                    }
                    resolve(totalValue);
                }
            }));
        });
    });
}
function getLatestPortfolioValueForToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        return getPortfolioValueForDate(date, token);
    });
}
function getLatestPortfolioValue() {
    return __awaiter(this, void 0, void 0, function* () {
        const date = new Date();
        const portfolioValueMap = new Map();
        const query = `SELECT token, SUM(CASE WHEN transaction_type = 'DEPOSIT' THEN amount ELSE -amount END) AS balance FROM transactions WHERE timestamp <= ${Math.floor(date.getTime() / 1000)} GROUP BY token`;
        return new Promise((resolve, reject) => {
            db.all(query, (err, rows) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject(err);
                }
                else {
                    for (const row of rows) {
                        const exchangeRate = yield getExchangeRate(row.token);
                        const value = row.balance * exchangeRate;
                        portfolioValueMap.set(row.token, value);
                    }
                    resolve(portfolioValueMap);
                }
            }));
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            const portfolioValueMap = yield getLatestPortfolioValue();
            console.log('Latest portfolio value per token in USD:');
            for (const [token, value] of portfolioValueMap.entries()) {
                console.log(`${token}: ${value}`);
            }
        }
        else if (args.length === 1) {
            const token = args[0];
            const value = yield getLatestPortfolioValueForToken(token);
            console.log(`Latest portfolio value for ${token} in USD: ${value}`);
        }
        else if (args.length === 2) {
            const date = new Date(args[0]);
            const token = args[1];
            const value = yield getPortfolioValueForDate(date, token);
            console.log(`Portfolio value for ${token} on ${date.toISOString()} in USD: ${value}`);
        }
        else if (args.length === 3) {
            const date = new Date(args[0]);
            const token = args[1];
            const value = yield getPortfolioValueForDate(date, token);
            console.log(`Portfolio value for ${token} on ${date.toISOString()} in USD: ${value}`);
        }
        else {
            console.log('Invalid arguments');
        }
        db.close();
    });
}
main();
//# sourceMappingURL=portfolio.js.map