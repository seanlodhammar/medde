import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { Socket } from "socket.io/dist/socket";
import Project from "../models/Project";
import Customer from "../models/Customer";


interface ProjectReq extends Request {
    project?: any;
}



const isAuthorized : RequestHandler = async(req: ProjectReq, res, next) => {
    if(!req.headers.authorization || req.headers.authorization.length < 1 || !req.headers.authorization.includes('Bearer')) {
        return res.sendStatus(401);
    }

    const access = req.headers.authorization.split(' ');

    if(access[0] !== 'Bearer') {
        return res.sendStatus(401);
    }

    const accessToken = access[1];

    if(!process.env.JWT_SECRET) {
        return res.sendStatus(500);
    };

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET) as { projectId: string; };

        const project = await Project.findById(decoded.projectId);

        if(!project || !project.host) {
            return res.sendStatus(500);
        }

        req.project = project;

        if(req.hostname === 'localhost' && project.host.includes('localhost')) {
            return next();
        }
        
        if(req.hostname !== project.host) {
            return res.status(400).json({
                error: 'Project host does not equal to the host the request was sent from.'
            });
        };

        next();
        return;
    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
}

export const isSocketConnectionAuthorized = async(socket: Socket, next: (err?: Error) => void) => {
    const accessToken = socket.handshake.auth.accessToken;
    const refusalError = new Error('Access token is invalid');

    if(!accessToken || accessToken.length < 1 || !accessToken.includes(`Bearer`)) {
        next(refusalError);
        return;
    };

    const accessTokenSplit = accessToken.split(' ');
    const token = accessTokenSplit[1];

    if(accessTokenSplit[0] !== 'Bearer') {
        next(refusalError);
        return;
    }

    if(!process.env.JWT_SECRET) {
        next(new Error('There was an issue with the API. Please check back later'));
        return;
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { projectId: string };

        const project = await Project.findById(decoded.projectId);
        
        if(!project || !project.host) {
            next(refusalError);
            return;
        }

        socket.data.project = project;
        
        if(socket.handshake.headers.origin !== project.host) {
            next(refusalError);
            return;
        }

        if(!socket.handshake.auth.customerId) {
            next(refusalError);
            return;
        }

        const customer = await Customer.findById(socket.handshake.auth.customerId).populate('conversations');

        if(!customer) {
            next(refusalError);
            return;
        }

        socket.data.customer = customer;

        next();
        return;
    } catch (e) {
        console.log(e);
        next(refusalError);
    }

}

export default isAuthorized;