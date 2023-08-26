"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Conversation = new mongoose_1.Schema({
    support: {
        type: mongoose_1.Types.ObjectId,
        required: false,
        ref: 'User',
    },
    fulfillmentStage: {
        type: String,
        required: true,
        default: 'pending',
    },
    customer: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'Customer',
    },
    messages: {
        type: Array,
        default: [],
        of: {
            type: {
                required: true,
                type: String,
            },
            message: {
                required: true,
                type: String,
            }
        },
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
        default: new Date().toLocaleDateString(),
    }
}, { versionKey: false });
exports.default = (0, mongoose_1.model)('Conversation', Conversation);
;
