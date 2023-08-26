import { RequestHandler, Request, NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';

interface UserReq extends Request {
    userId?: string;
}

const auth = (type: 'authenticated' | 'unauthenticated') => {
    return async(req: UserReq, res: Response, next: NextFunction) => {
        if(req.hostname !== 'localhost') {
            console.log('host');
            return res.sendStatus(401);
        };
        if(!req.headers.authorization || req.headers.authorization.length < 1 || !req.headers.authorization.includes('Bearer')) {
            if(type === 'unauthenticated') {
                return next();
            } else {
                return res.sendStatus(400);
            }
        };
    
        const token = req.headers.authorization.split(' ')[1]; // Bearer *token*

        if(!req.session.authSecret) {
            if(type === 'unauthenticated') {
                next();
                return;
            } else {
                return res.sendStatus(400);
            }
        }

    
        try {
            const decoded = await jwt.verify(token, req.session.authSecret) as { [props: string]: string };
            if(type === 'unauthenticated') {
                return res.sendStatus(400);
            }

            req.userId = decoded.userId;
            return next();
        } catch (e) {
            if(type === 'unauthenticated') {
                return next();
            }
            return res.sendStatus(400);
        }
    }
}

export default (auth as unknown) as (type: 'authenticated' | 'unauthenticated') => RequestHandler;