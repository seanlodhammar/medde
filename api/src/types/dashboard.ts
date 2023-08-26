import { Types } from "mongoose";

export interface ProjectInterface {
    _id: string;
    ownerId: Types.ObjectId;
    name: string;
    clientId: string;
    clientSecret?: string;
    host?: string;
    createdAt: Date;
    customers?: {
        name: string;
        messages: string[];
    }
}