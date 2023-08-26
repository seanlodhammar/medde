import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongodb-session';
import { createAccessToken, createCustomer, createSupportRequest } from '../controllers/api';
import cors from 'cors';

import dashboardRoutes from './dashboard';
import isAuthorized from '../middleware/isAuthorized';
import isCustomer from '../middleware/isCustomer';
import Conversation from '../models/Conversation';

const router = express.Router();
const MongoDBStore = MongoStore(session);

router.post('/authorize', createAccessToken);

const store = new MongoDBStore({
    uri: `mongodb+srv://sean:${process.env.MONGODB_PASSWORD}@testcluster.cfgo7qm.mongodb.net/medde`,
    collection: 'api-sessions',
})

declare module 'express-session' {
    interface SessionData {
        currentConversation: any;
    }
}

export const apiSession = session({
    secret: `${process.env.SESSION_SECRET}`,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 12 * 60 * 60 * 1000,
    },
    store: store,
})

router.use(apiSession);
router.use(isAuthorized);

router.post('/create-customer', createCustomer);
router.post('/create-support-request', isCustomer, createSupportRequest)


export default router;