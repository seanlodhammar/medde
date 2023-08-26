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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (type) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.hostname !== 'localhost') {
            console.log('host');
            return res.sendStatus(401);
        }
        ;
        if (!req.headers.authorization || req.headers.authorization.length < 1 || !req.headers.authorization.includes('Bearer')) {
            if (type === 'unauthenticated') {
                return next();
            }
            else {
                return res.sendStatus(400);
            }
        }
        ;
        const token = req.headers.authorization.split(' ')[1]; // Bearer *token*
        if (!req.session.authSecret) {
            if (type === 'unauthenticated') {
                next();
                return;
            }
            else {
                return res.sendStatus(400);
            }
        }
        try {
            const decoded = yield jsonwebtoken_1.default.verify(token, req.session.authSecret);
            if (type === 'unauthenticated') {
                return res.sendStatus(400);
            }
            req.userId = decoded.userId;
            return next();
        }
        catch (e) {
            if (type === 'unauthenticated') {
                return next();
            }
            return res.sendStatus(400);
        }
    });
};
exports.default = auth;