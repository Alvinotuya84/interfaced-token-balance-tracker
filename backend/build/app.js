var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import * as cryptoCompare from './cryptoCompare.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.get('/portfolio-value-per-token', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const value = yield cryptoCompare.getLatestPortfolioValuePerToken();
    res.json(value);
}));
app.get('/portfolio-value-per-token/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const value = yield cryptoCompare.getLatestPortfolioValueForToken(token);
    res.json(value);
}));
app.get('/portfolio-value-per-token/:token/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const date = parseInt(req.params.date);
    const value = yield cryptoCompare.getPortfolioValueForTokenOnDate(token, date);
    res.json(value);
}));
app.get('/portfolio-value/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = parseInt(req.params.date);
    const value = yield cryptoCompare.getPortfolioValueOnDate(date);
    res.json(value);
}));
app.listen(3001, () => {
    console.log('Server listening on port 3001');
});
//# sourceMappingURL=app.js.map