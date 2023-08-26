import { User } from "./auth-types";

export interface Message {
    content: string;
    createdAt: Date,
    userId: string;
    recipientId: string;
}

export interface CollaboratorInterface {
    permission: 'Admin' | 'Developer' | 'Support';
    userId: string;
    email: string; 
    dateAdded: string;
    _id: string;
    status: 'Pending' | 'Member';
}

export interface ProjectInterface {
    project: {
        _id: string;
        ownerId: string;
        clientId: string;
        clientSecret: boolean;
        host?: string;
        name: string;
        createdAt: string;
        customers: { name: string; messages: Message[]; }[];
        collaborators: CollaboratorInterface[]
    };  
    permission: 'Admin' | 'Developer' | 'Support' | 'Owner';
}

export interface SingularProject {
    _id: string;
    ownerId: string;
    clientId: string;
    clientSecret: boolean;
    host?: string;
    name: string;
    createdAt: string;
    customers: { name: string; messages: Message[]; }[];
    collaborators: CollaboratorInterface[];
    permission: 'Admin' | 'Developer' | 'Support' | 'Owner';
}