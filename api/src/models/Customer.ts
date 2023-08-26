import { Schema, Types, model } from 'mongoose';

const Customer = new Schema({
    conversations: {
        ref: 'Conversation',
        type: Array,
        of: Types.ObjectId,
        required: false,
    }
}, { versionKey: false });

export default model('Customer', Customer);