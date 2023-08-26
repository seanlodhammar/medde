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
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../controllers/auth");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = express_1.default.Router();
const emailValidator = () => ((0, express_validator_1.body)('email').isEmail().withMessage('Email must contain an @ symbol'));
const passwordValidator = () => ((0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Must have a minimum length of 8 characters').isAlphanumeric().withMessage('Must be alphanumeric'));
router.post('/login', (0, isAuth_1.default)('unauthenticated'), emailValidator().custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: value });
    if (!user) {
        throw new Error('Could not find account');
    }
    ;
    req.userId = user._id.toString();
    req.passwordHash = user.password;
})), passwordValidator().custom((value, { req }) => {
    if (!req.userId) {
        throw new Error('Could not find account');
    }
    ;
    const comparison = bcrypt_1.default.compareSync(value, req.passwordHash);
    if (!comparison) {
        throw new Error('Invalid password');
    }
    return true;
}), auth_1.login);
router.post('/signup', (0, isAuth_1.default)('unauthenticated'), emailValidator().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: value });
    if (user) {
        throw new Error('User with same email address found');
    }
    ;
})), passwordValidator(), auth_1.signup);
router.get('/user', (0, isAuth_1.default)('authenticated'), auth_1.user);
router.post('/logout', (0, isAuth_1.default)('authenticated'), auth_1.logout);
exports.default = router;
