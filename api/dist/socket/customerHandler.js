"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customerHandler = (io, socket) => {
    socket.on('something', () => {
        console.log('wow');
    });
};
exports.default = customerHandler;
