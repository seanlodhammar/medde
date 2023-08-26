"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User = new mongoose_1.Schema({
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    projects: {
        type: Array,
        of: {
            project: {
                type: mongoose_1.Types.ObjectId,
                required: true,
                ref: 'Project',
            },
            permission: {
                type: String,
                required: true,
            }
        },
        required: true,
        default: [],
    },
    requests: {
        type: Array,
        of: {
            requestedBy: {
                type: String,
                required: true,
            },
            projectName: {
                type: String,
                required: true,
            },
            permission: {
                type: String,
                required: true,
            }
        }
    }
}, { versionKey: false });
exports.default = (0, mongoose_1.model)('User', User);
