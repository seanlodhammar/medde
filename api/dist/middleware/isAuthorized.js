"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSocketConnectionAuthorized = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Project_1 = __importDefault(require("../models/Project"));
const Customer_1 = __importDefault(require("../models/Customer"));
const isAuthorized = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.headers.authorization || req.headers.authorization.length < 1 || !req.headers.authorization.includes('Bearer')) {
        return res.sendStatus(401);
    }
    const access = req.headers.authorization.split(' ');
    if (access[0] !== 'Bearer') {
        return res.sendStatus(401);
    }
    const accessToken = access[1];
    if (!process.env.JWT_SECRET) {
        return res.sendStatus(500);
    }
    ;
    try {
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        const project = yield Project_1.default.findById(decoded.projectId);
        if (!project || !project.host) {
            return res.sendStatus(500);
        }
        req.project = project;
        if (req.hostname === 'localhost' && project.host.includes('localhost')) {
            return next();
        }
        if (req.hostname !== project.host) {
            return res.status(400).json({
                error: 'Project host does not equal to the host the request was sent from.'
            });
        }
        ;
        next();
        return;
    }
    catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});
const isSocketConnectionAuthorized = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = socket.handshake.auth.accessToken;
    const refusalError = new Error('Access token is invalid');
    if (!accessToken || accessToken.length < 1 || !accessToken.includes(`Bearer`)) {
        next(refusalError);
        return;
    }
    ;
    const accessTokenSplit = accessToken.split(' ');
    const token = accessTokenSplit[1];
    if (accessTokenSplit[0] !== 'Bearer') {
        next(refusalError);
        return;
    }
    if (!process.env.JWT_SECRET) {
        next(new Error('There was an issue with the API. Please check back later'));
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const project = yield Project_1.default.findById(decoded.projectId);
        if (!project || !project.host) {
            next(refusalError);
            return;
        }
        socket.data.project = project;
        if (socket.handshake.headers.origin !== project.host) {
            next(refusalError);
            return;
        }
        if (!socket.handshake.auth.customerId) {
            next(refusalError);
            return;
        }
        const customer = yield Customer_1.default.findById(socket.handshake.auth.customerId).populate('conversations');
        if (!customer) {
            next(refusalError);
            return;
        }
        socket.data.customer = customer;
        next();
        return;
    }
    catch (e) {
        console.log(e);
        next(refusalError);
    }
});
exports.isSocketConnectionAuthorized = isSocketConnectionAuthorized;
exports.default = isAuthorized;
