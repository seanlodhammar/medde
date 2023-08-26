import express from 'express';
import { body } from 'express-validator';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { login, signup, user, logout } from '../controllers/auth';

import auth from '../middleware/isAuth';

const router = express.Router();

const emailValidator = () => (body('email').isEmail().withMessage('Email must contain an @ symbol'));
const passwordValidator = () => (body('password').isLength({ min: 8 }).withMessage('Must have a minimum length of 8 characters').isAlphanumeric().withMessage('Must be alphanumeric'));

router.post('/login', auth('unauthenticated'), emailValidator().custom(async(value, { req }) => {
    const user = await User.findOne({ email: value });
    if(!user) {
        throw new Error('Could not find account');
    };
    req.userId = user._id.toString();
    req.passwordHash = user.password;
}), passwordValidator().custom((value, { req }) => {
    if(!req.userId) {
        throw new Error('Could not find account');
    };
    const comparison = bcrypt.compareSync(value, req.passwordHash);
    if(!comparison) {
        throw new Error('Invalid password');
    }
    return true;
}), login); 

router.post('/signup', auth('unauthenticated'), emailValidator().custom(async(value) => {
    const user = await User.findOne({email: value});
    if(user) {
        throw new Error('User with same email address found');
    };
}), passwordValidator(), signup);

router.get('/user', auth('authenticated'), user);

router.post('/logout', auth('authenticated'), logout);

export default router;