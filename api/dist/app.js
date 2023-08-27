"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./routes/api"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(body_parser_1.default.json());
mongoose_1.default.connect(`${process.env.MONGODB_URI}`).then().catch((err) => {
    console.log(err);
});
app.use('/dashboard', (0, cors_1.default)({ origin: 'http://localhost:3001', methods: ['GET', 'POST', 'DELETE', 'PUT'], credentials: true, }), dashboard_1.default);
app.use('/api', (0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }), api_1.default);
server.listen(5000);
exports.default = server;
require("./socket/base");
