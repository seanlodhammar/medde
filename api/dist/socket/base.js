"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("../app"));
const api_1 = require("../routes/api");
const isAuthorized_1 = require("../middleware/isAuthorized");
const customer_1 = __importDefault(require("./customer"));
const io = new socket_io_1.Server(app_1.default);
io.engine.use(api_1.apiSession);
io.use(isAuthorized_1.isSocketConnectionAuthorized);
const onConnection = (socket) => {
    (0, customer_1.default)(io, socket);
};
io.on('connection', onConnection);
exports.default = io;
require("./customer");
