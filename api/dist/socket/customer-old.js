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
const isAuthorized_1 = require("../middleware/isAuthorized");
const Conversation_1 = __importDefault(require("../models/Conversation"));
const base_1 = __importDefault(require("./base"));
const mongoose_1 = require("mongoose");
const customerNamespace = base_1.default.of('customers');
customerNamespace.use(isAuthorized_1.isSocketConnectionAuthorized);
const ObjectId = mongoose_1.Types.ObjectId;
customerNamespace.on('connection', (socket) => {
    const customer = socket.data.customer;
    socket.on('new support request', () => __awaiter(void 0, void 0, void 0, function* () {
        const customerId = customer._id;
        try {
            const conversation = new Conversation_1.default({ customer: customerId });
            const save = yield conversation.save();
            customer.conversations.push(save._id);
            const customerSave = yield customer.save();
            socket.data.customer = customerSave;
            const conversationId = conversation._id.toString();
            socket.data.currentConversation = conversationId;
            socket.join(conversationId);
            socket.emit('conversation joined', save);
        }
        catch (e) {
            console.log(e);
        }
    }));
    socket.on('get conversations', () => __awaiter(void 0, void 0, void 0, function* () {
        if (!customer) {
            console.log('damn');
        }
        socket.emit('give conversations', customer.conversations);
    }));
    socket.on('join conversation', (conversationId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conversation = yield Conversation_1.default.findById(conversationId).populate('customer');
            if (!conversation) {
                socket.emit('error');
                return;
            }
            ;
            const id = conversation._id.toString();
            socket.data.currentConversation = id;
            socket.join(id);
            socket.emit('conversation joined', conversation);
        }
        catch (e) {
            console.log(e);
        }
    }));
    socket.on('send message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messageData = { type: 'customer', message: message, _id: new ObjectId() };
            const conversationId = socket.data.currentConversation;
            const conversation = yield Conversation_1.default.findById(conversationId);
            if (!conversation) {
                console.log('whoops');
                socket.emit('error');
                return;
            }
            conversation.messages.push(messageData);
            const save = yield conversation.save();
            base_1.default.of('customers').in(conversationId).emit('message sent', save.messages);
        }
        catch (e) {
            console.log(e);
            socket.emit('error');
        }
    }));
    socket.on('leave conversation', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = socket.data.currentConversation;
        if (!id || id.length < 1 || typeof id !== 'string') {
        }
        socket.leave(id);
        socket.emit('left conversation');
    }));
});
