import { ObjectId, Types } from "mongoose";

export interface CustomerInterface {
    _id: Types.ObjectId;
    conversations: { supportId: ObjectId; fulfillmentStage: 'pending' | 'accepted' | 'closed'; customerId: ObjectId; messages: { type: 'me' | 'other'; message: string }; createdAt: string; }[]
}