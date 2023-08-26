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
exports.logout = exports.user = exports.signup = exports.login = void 0;
const crypto_1 = require("crypto");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(400).json({
            errors: result.array()
        });
        return;
    }
    try {
        if (!req.userId) {
            res.sendStatus(500);
            return;
        }
        const secret = (0, crypto_1.randomBytes)(16).toString('hex');
        req.session.authSecret = secret;
        const token = jsonwebtoken_1.default.sign({ userId: req.userId }, secret, { expiresIn: '12h' });
        return res.cookie('dash-auth-token', token, { maxAge: 12 * 60 * 60 * 1000, path: '/' }).sendStatus(200);
    }
    catch (e) {
        return res.sendStatus(500);
    }
});
exports.login = login;
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            res.status(400).json({
                errors: result.array()
            });
            return;
        }
        const { email, password } = req.body;
        const hash = bcrypt_1.default.hashSync(password, 12);
        const newUser = new User_1.default({ email: email, password: hash });
        yield newUser.save();
        const secret = (0, crypto_1.randomBytes)(16).toString('hex');
        req.session.authSecret = secret;
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id.toString() }, secret, { expiresIn: '12h' });
        return res.cookie('dash-auth-token', token, { maxAge: 12 * 60 * 60 * 1000, path: '/' }).sendStatus(200);
    }
    catch (e) {
        return res.sendStatus(500);
    }
});
exports.signup = signup;
const user = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        res.sendStatus(401);
        return;
    }
    try {
        if (req.session.user && req.session.user.id === req.userId) {
            res.status(200).json({
                user: { id: req.session.user.id, email: req.session.user.email }
            });
            return;
        }
        const user = yield User_1.default.findById(req.userId, '-password');
        if (!user) {
            res.sendStatus(500);
            return;
        }
        const userId = user._id.toString();
        req.session.user = { id: userId, email: user.email };
        res.status(200).json({
            user: { id: userId, email: user.email },
        });
        return;
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
        return;
    }
});
exports.user = user;
const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            next(err);
            return;
        }
        res.sendStatus(200);
    });
};
exports.logout = logout;
