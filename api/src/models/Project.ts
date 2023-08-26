import { Schema, Types, model } from 'mongoose';

const Project = new Schema({
    ownerId: {
        ref: 'User',
        type: Types.ObjectId,
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
                type: Types.ObjectId,
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
            customer: Types.ObjectId,
            creationDate: {
                type: Date,
                default: new Date().getMonth(),
                required: true,
            }
        },
        default: [],
        required: false,
    },
}, { versionKey: false })

export default model('Project', Project)