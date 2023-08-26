import { model, Types, Schema } from 'mongoose';

const User = new Schema({
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
                type: Types.ObjectId,
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
}, { versionKey: false })

export default model('User', User);