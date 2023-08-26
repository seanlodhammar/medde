import { NextFunction, Request, RequestHandler, Response } from "express";

interface Req extends Request {
    [props: string]: any;
}

const isStored = (name: string) => {
    return (req: Req, res: Response, next: NextFunction) => {
        const session = (req.session as unknown) as { [props: string]: any };
        const stored = session[name];
        if(!stored) {
            req.stored = false;
            next();
            return;
        }
        req.stored = true;
        next();
    };
}

export default (isStored as unknown) as (name: string) => RequestHandler;