import 'dotenv/config';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

import apiRoutes from './routes/api';
import dashboardRoutes from './routes/dashboard';

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());


mongoose.connect(`mongodb+srv://sean:${process.env.MONGODB_PASSWORD}@testcluster.cfgo7qm.mongodb.net/medde`).then().catch((err) => {
    console.log(err);
});

app.use('/dashboard', cors({origin: 'http://localhost:3001', methods: ['GET', 'POST', 'DELETE', 'PUT'], credentials: true,}), dashboardRoutes);
app.use('/api', cors({ origin: 'http://localhost:3000', credentials: true }), apiRoutes);

server.listen(5000);

export default server;

import './socket/base';