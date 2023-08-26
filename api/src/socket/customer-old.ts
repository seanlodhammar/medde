import { Socket } from 'socket.io';
import { isSocketConnectionAuthorized } from '../middleware/isAuthorized';
import Conversation from '../models/Conversation';
import Customer from '../models/Customer';
import io from './base';
import { Types } from 'mongoose';

const customerNamespace = io.of('customers');

customerNamespace.use(isSocketConnectionAuthorized);


const ObjectId = Types.ObjectId;

interface Message {
    type: 'customer' | 'support';
    message: string;
    _id: Types.ObjectId;
}

customerNamespace.on('connection', (socket) => {
    const customer = socket.data.customer;
    
    socket.on('new support request', async() => {
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
    })



    socket.on('get conversations', async() => {
        if(!customer) {
            console.log('damn');
        }
        socket.emit('give conversations', customer.conversations);
    })

    socket.on('join conversation', async(conversationId: string) => {
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
    })

    socket.on('send message', async(message: string) => {
        try {
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
            io.of('customers').in(conversationId).emit('message sent', save.messages);
        } catch (e) {
            console.log(e);
            socket.emit('error');
        }

    })

    socket.on('leave conversation', async() => {
        const id = socket.data.currentConversation;
        if(!id || id.length < 1 || typeof id !== 'string') {
            
        }
        socket.leave(id);
        socket.emit('left conversation');
    })
});