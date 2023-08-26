"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_1 = __importDefault(require("./handlers/customer"));
const customerListener = (io, socket) => {
    const { newSupportRequest, getConversations, joinConversation, sendMessage, leaveConversation } = (0, customer_1.default)(io, socket);
    socket.on('new support request', newSupportRequest);
    socket.on('get conversations', getConversations);
    socket.on('join conversation', joinConversation);
    socket.on('send message', sendMessage);
    socket.on('leave conversation', leaveConversation);
};
exports.default = customerListener;
