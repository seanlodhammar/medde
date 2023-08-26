"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isStored = (name) => {
    return (req, res, next) => {
        const session = req.session;
        const stored = session[name];
        if (!stored) {
            req.stored = false;
            next();
            return;
        }
        req.stored = true;
        next();
    };
};
exports.default = isStored;
