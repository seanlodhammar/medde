import { RequestHandler } from 'express';

const isMainhost : RequestHandler = (req, res, next) => {

    const hostname = req.hostname;
    const mainHost = 'http://localhost:3000'

    if(hostname !== mainHost) {
        res.sendStatus(401);
        return;
    }

    next();

}

export default isMainhost;