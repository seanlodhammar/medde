import { NextFunction, Request, RequestHandler, Response } from "express";
import Project from "../models/Project";
import { ProjectInterface } from "../types/dashboard";
import { Types } from 'mongoose';

interface UserReq extends Request {
    userId?: string;
    project?: ProjectInterface;
}

const checkUserAccess = (key: 'project', checkSession: boolean) => {
    return async(req: UserReq, res: Response, next: NextFunction) => {
        if(key === 'project') {
            try {
                const { projectId } = req.params;
                if(!projectId || projectId.length < 1 || !req.userId || req.userId.length < 1) {
                    return res.sendStatus(400);
                }

                if(checkSession && req.session.project && req.session.project._id === projectId) {
                    const projectSessionUserId = req.session.project.ownerId.toString();
                    if(projectSessionUserId !== req.userId) {
                        res.sendStatus(403);
                        return;
                    }
                    
                    res.status(200).json({
                        ...req.session.project,
                    });
                    return;
                }

                const project = await Project.findById(projectId);
                if(!project) {
                    return res.sendStatus(500);
                }
    
                const projectUserId = project.ownerId.toString();
                
                if(projectUserId !== req.userId.toString()) {
                    return res.sendStatus(403);
                }
                req.project = (project as unknown) as ProjectInterface;
                next();
            } catch (e) {
                res.sendStatus(500);
                return;
            }
        }
    };
}

export default (checkUserAccess as unknown) as (key: 'project', checkSession: boolean) => RequestHandler;