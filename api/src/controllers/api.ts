import { Request, RequestHandler } from 'express';
import Project from '../models/Project';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import Customer from '../models/Customer';
import Conversation from '../models/Conversation';
import { ObjectId } from 'mongoose';

interface Req extends Request {
    project?: any;
    customer?: any;
}

export const createAccessToken : RequestHandler = async(req, res, next) => {
    try {
        const { clientId, clientSecret } = req.body;
        const project = await Project.findOne({ clientId: clientId, clientSecret: clientSecret });
        if(!project) {
            res.sendStatus(400).json({
                error: 'No project found. Double check your ClientID and Client Secret or create a project on the Medde Dashboard.',
            });
            return;
        }

        if(!project.host) {
            res.status(400).json({
                error: 'No host found. Go to the Medde Dashboard to set one.',
            })
            return;
        }

        const accessSecret = process.env.JWT_SECRET;
        if(!accessSecret) {
            return res.sendStatus(500);
        }

        const accessToken = jwt.sign({ projectId: project._id.toString() }, accessSecret, { expiresIn: '12h' });

        res.status(200).json({
            accessToken: accessToken,
        })
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
    
}

export const createCustomer : RequestHandler = async(req: Req, res, next) => {
    try {
        const customer = new Customer();
        const save = await customer.save();
        const customerId = save._id.toString();
    
        req.project.customers.push(save._id);
        await req.project.save();
    
        res.cookie('medde-customer-id', customerId, { maxAge: 6240 * 60 * 60 * 1000}).sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
    return;
}

export const createSupportRequest : RequestHandler = async(req: Req, res, _) => {

    try {
        const conversation = new Conversation({ customerId: req.customer._id  });
        const save = await conversation.save();

        req.session.currentConversation = save;
        
        const conversationId = save._id.toString();
        res.status(201).json({
            conversationId: conversationId
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}