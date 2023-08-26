import { ObjectId, Schema, SchemaType, Types, model } from 'mongoose';

const Conversation = new Schema({
    support: {
        type: Types.ObjectId,
        required: false,
        ref: 'User',
    },
    fulfillmentStage: {
        type: String,
        required: true,
        default: 'pending',
    },
    customer: {
        type: Types.ObjectId,
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

interface ConversationSchema extends SchemaType {
    supportId: ObjectId;
    customerId: ObjectId;
    messages: { type: 'customer' | 'support'; message: string }[];
}

export default model('Conversation', Conversation);;