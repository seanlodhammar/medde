import { randomBytes } from 'crypto';
import { Request, RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';

interface UserReq extends Request {
    userId?: string
}

export const login : RequestHandler = async(req : UserReq, res, next) => {
    const result = validationResult(req);
    if(!result.isEmpty()) {
        res.status(400).json({
            errors: result.array()
        })
        return;
    }

    try {
        if(!req.userId) {
            res.sendStatus(500);
            return;
        }

        const secret = randomBytes(16).toString('hex');
        req.session.authSecret = secret;
        const token = jwt.sign({ userId: req.userId }, secret, { expiresIn: '12h' });

    
        return res.cookie('dash-auth-token', token, { maxAge: 12 * 60 * 60 * 1000, path: '/' }).sendStatus(200);
    } catch (e) {
        return res.sendStatus(500);
    }
}

export const signup : RequestHandler = async(req, res, next) => {
    try {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            res.status(400).json({
                errors: result.array()
            });
            return;
        }
    
    
        const { email, password } = req.body;
        const hash = bcrypt.hashSync(password, 12);
    
        const newUser = new User({ email: email, password: hash });
        await newUser.save();
    
        const secret = randomBytes(16).toString('hex');
        req.session.authSecret = secret;
        const token = jwt.sign({ userId: newUser._id.toString() }, secret, { expiresIn: '12h' });
    
        return res.cookie('dash-auth-token', token, { maxAge: 12 * 60 * 60 * 1000, path: '/' }).sendStatus(200);
    } catch (e) {
        return res.sendStatus(500);
    }
}

export const user : RequestHandler = async(req: UserReq, res, next) => {
    if(!req.userId) {
        res.sendStatus(401);
        return;
    }
    try {
        if(req.session.user && req.session.user.id === req.userId) {
            res.status(200).json({
                user: { id: req.session.user.id, email: req.session.user.email  }
            });
            return;
        }
        const user = await User.findById(req.userId, '-password');
        if(!user) {
            res.sendStatus(500);
            return;
        }
        const userId = user._id.toString();
        req.session.user = { id: userId, email: user.email };
        res.status(200).json({
            user: { id: userId, email: user.email  },
        });
        return;
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        return;
    }
}

export const logout : RequestHandler = (req, res, next) => {
    req.session.destroy((err) => {
        if(err) {
            next(err);
            return;
        }
        res.sendStatus(200);
    })
}