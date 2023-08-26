import { Server, Socket } from "socket.io";
import customerHandler from "./handlers/customer";

const customerListener = (io: Server, socket: Socket) => {
    const { newSupportRequest, getConversations, joinConversation, sendMessage, leaveConversation } = customerHandler(io, socket);

    socket.on('new support request', newSupportRequest);
    socket.on('get conversations', getConversations);
    socket.on('join conversation', joinConversation);
    socket.on('send message', sendMessage);
    socket.on('leave conversation', leaveConversation);

}

export default customerListener;