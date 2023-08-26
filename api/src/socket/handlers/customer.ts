import { Server, Socket } from 'socket.io';
import { Types } from 'mongoose';
import Conversation from '../../models/Conversation';

const ObjectId = Types.ObjectId;

interface Message {
    type: 'customer' | 'support';
    message: string;
    _id: Types.ObjectId;
}

export default (io: Server, socket: Socket) => {
    const customer = socket.data.customer;
    
    const newSupportRequest = async() => {
        const customerId = customer._id;
        try {
            const conversation = new Conversation({ customer: customerId });
            const save = await conversation.save();
    
            customer.conversations.push(save._id);
            const customerSave = await customer.save();
            socket.data.customer = customerSave;
            const conversationId = conversation._id.toString();
    
            socket.data.currentConversation = conversationId;
            socket.join(conversationId);
    
            socket.emit('conversation joined', save);
        } catch (e) {
            console.log(e);
    
        }
    }

    const getConversations = async() => {
        if(!customer) {
            console.log('damn');
        }
        socket.emit('give conversations', customer.conversations);
    }

    const joinConversation = async(conversationId: string) => {
        try {
            const conversation = await Conversation.findById(conversationId).populate('customer');

            if(!conversation) {
                socket.emit('error');    
                return;
            };

            const id = conversation._id.toString();
            
            socket.data.currentConversation = id;
            socket.join(id)
            socket.emit('conversation joined', conversation);
        } catch (e) {
            console.log(e);
        }
    }

    const sendMessage = async(message: string) => {
        try {

            if(!message || message.length < 1 || typeof message !== 'string') {
                return;
            }

            const messageData : Message = { type: 'customer', message: message, _id: new ObjectId() };
            const conversationId = socket.data.currentConversation;

            const conversation = await Conversation.findById(conversationId);
            if(!conversation) {
                console.log('whoops');
                socket.emit('error');
                return;
            }
            conversation.messages.push(messageData);
            const save = await conversation.save();
            io.in(conversationId).emit('message sent', save.messages);
        } catch (e) {
            console.log(e);
            socket.emit('error');
        }
    }

    const leaveConversation = async() => {
        const id = socket.data.currentConversation;
        if(!id || id.length < 1 || typeof id !== 'string') {
            console.log('oops');
        }
        socket.leave(id);
        socket.emit('left conversation');
    }

    return { newSupportRequest, getConversations, joinConversation, sendMessage, leaveConversation };
};
