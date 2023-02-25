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
const API_KEY = process.env.CRYPTOCOMPARE_API_KEY;
function getLatestPortfolioValuePerToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC&tsyms=USD&api_key=${API_KEY}`);
        return response.data;
    });
}
function getLatestPortfolioValueForToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${API_KEY}`);
        return { [token]: response.data };
    });
}
function getPortfolioValueForTokenOnDate(token, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${token}&tsyms=USD&ts=${date}&api_key=${API_KEY}`);
        return { [token]: response.data[token].USD };
    });
}
function getPortfolioValueOnDate(date) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC&tsyms=USD&ts=${date}&api_key=${API_KEY}`);
        return response.data;
    });
}
export { getLatestPortfolioValuePerToken, getLatestPortfolioValueForToken, getPortfolioValueForTokenOnDate, getPortfolioValueOnDate, };
//# sourceMappingURL=cryptoCompare.js.map