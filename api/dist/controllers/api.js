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
exports.createSupportRequest = exports.createCustomer = exports.createAccessToken = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Customer_1 = __importDefault(require("../models/Customer"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const createAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clientId, clientSecret } = req.body;
        const project = yield Project_1.default.findOne({ clientId: clientId, clientSecret: clientSecret });
        if (!project) {
            res.sendStatus(400).json({
                error: 'No project found. Double check your ClientID and Client Secret or create a project on the Medde Dashboard.',
            });
            return;
        }
        if (!project.host) {
            res.status(400).json({
                error: 'No host found. Go to the Medde Dashboard to set one.',
            });
            return;
        }
        const accessSecret = process.env.JWT_SECRET;
        if (!accessSecret) {
            return res.sendStatus(500);
        }
        const accessToken = jsonwebtoken_1.default.sign({ projectId: project._id.toString() }, accessSecret, { expiresIn: '12h' });
        res.status(200).json({
            accessToken: accessToken,
        });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
exports.createAccessToken = createAccessToken;
const createCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = new Customer_1.default();
        const save = yield customer.save();
        const customerId = save._id.toString();
        req.project.customers.push(save._id);
        yield req.project.save();
        res.cookie('medde-customer-id', customerId, { maxAge: 6240 * 60 * 60 * 1000 }).sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
    return;
});
exports.createCustomer = createCustomer;
const createSupportRequest = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversation = new Conversation_1.default({ customerId: req.customer._id });
        const save = yield conversation.save();
        req.session.currentConversation = save;
        const conversationId = save._id.toString();
        res.status(201).json({
            conversationId: conversationId
        });
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
exports.createSupportRequest = createSupportRequest;
