"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isMainhost = (req, res, next) => {
    const hostname = req.hostname;
    const mainHost = 'http://localhost:3000';
    if (hostname !== mainHost) {
        res.sendStatus(401);
        return;
    }
    next();
};
exports.default = isMainhost;
