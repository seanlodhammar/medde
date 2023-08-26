"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Project = new mongoose_1.Schema({
    ownerId: {
        ref: 'User',
        type: mongoose_1.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        required: true,
    },
    clientSecret: {
        type: String,
        required: false,
    },
    host: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: new Date(),
        required: true,
    },
    collaborators: {
        type: Array,
        of: {
            permission: {
                type: String,
                required: true,
            },
            userId: {
                type: mongoose_1.Types.ObjectId,
                required: true,
            },
            dateAdded: {
                type: String,
                required: true,
                default: new Date().toLocaleDateString(),
            },
            email: {
                type: String,
                required: true,
            },
            status: {
                type: String,
                required: true,
                default: 'Pending',
            }
        },
        required: true,
        default: [],
    },
    customers: {
        ref: 'Customers',
        type: Array,
        of: {
            customer: mongoose_1.Types.ObjectId,
            creationDate: {
                type: Date,
                default: new Date().getMonth(),
                required: true,
            }
        },
        default: [],
        required: false,
    },
}, { versionKey: false });
exports.default = (0, mongoose_1.model)('Project', Project);
