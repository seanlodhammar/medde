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
const Customer_1 = __importDefault(require("../models/Customer"));
const isCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.headers['medde-customer-id'];
    if (!customerId) {
        res.sendStatus(500);
    }
    const customer = yield Customer_1.default.findById(customerId);
    if (!customer) {
        res.sendStatus(500); // add code later to create customer in db and send back id as cookie
        return;
    }
    ;
    req.customer = customer;
    next();
});
exports.default = isCustomer;
