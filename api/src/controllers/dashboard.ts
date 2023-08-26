import { randomBytes } from "crypto";
import { Request, RequestHandler } from "express";
import { Types } from 'mongoose';
import Project from "../models/Project";
import User from "../models/User";
import NodeCache from "node-cache";
import { ProjectInterface } from "../types/dashboard";

const ObjectId = Types.ObjectId;

interface Req extends Request {
    [props: string]: any;
}

export const createProject : RequestHandler = async(req: Req, res, _) => {
    try {
        const { name } = req.body;

        if(!name || typeof name !== 'string' || name.length < 5 || name.length > 35) {
            return res.sendStatus(400);
        }

        const clientId = randomBytes(16).toString('hex');

        const ownerId = new ObjectId(req.userId);

        const trimmedName = name.trim();

        const newProject = new Project({ ownerId: ownerId, clientId: clientId, name: trimmedName });
        await newProject.save();

        const user = await User.findById(ownerId);

        if(!user) {
            res.sendStatus(500);
            return;
        }

        user.projects.push({ project: newProject._id, permission: 'Owner' });
        const save = await user.save();
        req.session.projects = save.projects;

        res.status(201).json({
            projectId: newProject._id.toString(),
        })
        return;
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
        return;
    }
}

export const removeProject : RequestHandler = async(req: Req, res, next) => {
    const { projectId } = req.params;
    try {
        const user = await User.findById(req.userId).populate('projects');
        if(!user) {
            return res.sendStatus(500);
        }
        const findProject = user.projects.findIndex(({ project }) => project._id.toString() === projectId);

        if((findProject === -1)) {
            return res.sendStatus(400);
        }
        
        await Project.deleteOne(user.projects[findProject].project);

        user.projects.splice(findProject, 1);
        const save = await user.save();

        req.session.projects = [ ...save.projects ];

        res.sendStatus(205);
        return;

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export const getProjects : RequestHandler = async(req: Req, res, next) => {
    // if(req.stored) {
    //     res.status(200).json({
    //         projects: req.session.projects,
    //     })
    //     return;
    // };
    try {
        const user = await User.findById(req.userId).populate({ path: 'projects', populate: { path: 'project', model: 'Project' } });
        if(!user) {
            res.sendStatus(401);
            return;
        };
        req.session.projects = [ ...user.projects ];
        res.status(200).json({
            projects: user.projects
        });
    } catch (e) {
        console.log(e);
        res.status(200).json({
            projects: [],
        })
    }

}
 
export const getProject : RequestHandler = async(req: Req, res, _) => {
    try {
        const project = req.project;

        let clientSecret = false;

        if(project.clientSecret) {
            clientSecret = true;
        }

        const userId = req.userId;
        const ownerId = project.ownerId.toString();

        let userPermission = '';

        if(userId === ownerId) {
            userPermission = 'Owner';
        }

        const findUserPermission = req.project.collaborators.findIndex((collaborator: { userId: Types.ObjectId }) => collaborator.userId.toString() === userId);

        if(findUserPermission !== -1) {
            userPermission = req.project.collaborators[findUserPermission].permission;
        }

        const projectObj = {
            clientId: project.clientId,
            clientSecret: clientSecret,
            createdAt: project.createdAt,
            name: project.name,
            _id: project._id.toString(),
            host: project.host,
            ownerId: project.ownerId.toString(),
            permission: userPermission,
            collaborators: project.collaborators,
        }


        req.session.project = ({ ...projectObj } as unknown) as ProjectInterface;

        res.status(200).json({
            ...projectObj
        })
    }
     catch (e) {
        console.log(e);
        res.sendStatus(500);
        return;
    }
}

export const generateSecret : RequestHandler = async(req: Req, res, _) => {
    try {
        const project = req.project;
        const clientSecret = randomBytes(20).toString('hex');
        project.clientSecret = clientSecret;
        const save = await project.save();
        req.session.project = save;
        res.status(201).json({
            clientSecret: clientSecret,
        })    
        return;
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export const setProjectHost : RequestHandler = async(req: Req, res, next) => {
    try {
        const project = req.project;
        const { host } = req.body;
        if(!host || host.length < 1 || !host.includes('http')) {
            return res.status(400).json({
                error: 'Must include "http" or "https" to be a valid host'
            });
        };
        if(project.host && project.host === host) {
            return res.sendStatus(201);
        }
        project.host = host;
        const save = await project.save();
        req.session.project = save;
        res.sendStatus(201);
        return;
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
}

export const addCollaborator : RequestHandler = async(req: Req, res, _) => {
    const { email, permission } = req.body;

    try {
        if(req.session.user && req.session.user.email === email) {
            res.sendStatus(400);
            return;
        }
        if(!req.session.user) {
            res.sendStatus(500);
            return;
        }
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.sendStatus(400);
        }

        const project = req.project;
        user.requests.push({ requestedBy: req.session.user.email, projectName: project.name, permission: permission });
        project.collaborators.push({ userId: user._id, permission: permission, email: user.email });

        await user.save();
        await project.save();

        req.session.project = project;

        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

};