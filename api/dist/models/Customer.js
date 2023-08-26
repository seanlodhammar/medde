"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Customer = new mongoose_1.Schema({
    conversations: {
        ref: 'Conversation',
        type: Array,
        of: mongoose_1.Types.ObjectId,
        required: false,
    }
}, { versionKey: false });
exports.default = (0, mongoose_1.model)('Customer', Customer);
