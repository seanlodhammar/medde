import { Server, Socket } from 'socket.io';
import httpServer from '../app';
import { apiSession } from '../routes/api';
import { isSocketConnectionAuthorized } from '../middleware/isAuthorized';

import customer from './customer';

const io = new Server(httpServer);

io.engine.use(apiSession);

io.use(isSocketConnectionAuthorized);

const onConnection = (socket: Socket) => {
    customer(io, socket);
}

io.on('connection', onConnection);

export default io;

import './customer';