"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCollaborator = exports.setProjectHost = exports.generateSecret = exports.getProject = exports.getProjects = exports.removeProject = exports.createProject = void 0;
const crypto_1 = require("crypto");
const mongoose_1 = require("mongoose");
const Project_1 = __importDefault(require("../models/Project"));
const User_1 = __importDefault(require("../models/User"));
const ObjectId = mongoose_1.Types.ObjectId;
const createProject = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name || typeof name !== 'string' || name.length < 5 || name.length > 35) {
            return res.sendStatus(400);
        }
        const clientId = (0, crypto_1.randomBytes)(16).toString('hex');
        const ownerId = new ObjectId(req.userId);
        const trimmedName = name.trim();
        const newProject = new Project_1.default({ ownerId: ownerId, clientId: clientId, name: trimmedName });
        yield newProject.save();
        const user = yield User_1.default.findById(ownerId);
        if (!user) {
            res.sendStatus(500);
            return;
        }
        user.projects.push({ project: newProject._id, permission: 'Owner' });
        const save = yield user.save();
        req.session.projects = save.projects;
        res.status(201).json({
            projectId: newProject._id.toString(),
        });
        return;
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
        return;
    }
});
exports.createProject = createProject;
const removeProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    try {
        const user = yield User_1.default.findById(req.userId).populate('projects');
        if (!user) {
            return res.sendStatus(500);
        }
        const findProject = user.projects.findIndex(({ project }) => project._id.toString() === projectId);
        if ((findProject === -1)) {
            return res.sendStatus(400);
        }
        yield Project_1.default.deleteOne(user.projects[findProject].project);
        user.projects.splice(findProject, 1);
        const save = yield user.save();
        req.session.projects = [...save.projects];
        res.sendStatus(205);
        return;
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
exports.removeProject = removeProject;
const getProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // if(req.stored) {
    //     res.status(200).json({
    //         projects: req.session.projects,
    //     })
    //     return;
    // };
    try {
        const user = yield User_1.default.findById(req.userId).populate({ path: 'projects', populate: { path: 'project', model: 'Project' } });
        if (!user) {
            res.sendStatus(401);
            return;
        }
        ;
        req.session.projects = [...user.projects];
        res.status(200).json({
            projects: user.projects
        });
    }
    catch (e) {
        console.log(e);
        res.status(200).json({
            projects: [],
        });
    }
});
exports.getProjects = getProjects;
const getProject = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = req.project;
        let clientSecret = false;
        if (project.clientSecret) {
            clientSecret = true;
        }
        const userId = req.userId;
        const ownerId = project.ownerId.toString();
        let userPermission = '';
        if (userId === ownerId) {
            userPermission = 'Owner';
        }
        const findUserPermission = req.project.collaborators.findIndex((collaborator) => collaborator.userId.toString() === userId);
        if (findUserPermission !== -1) {
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
        };
        req.session.project = Object.assign({}, projectObj);
        res.status(200).json(Object.assign({}, projectObj));
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
        return;
    }
});
exports.getProject = getProject;
const generateSecret = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = req.project;
        const clientSecret = (0, crypto_1.randomBytes)(20).toString('hex');
        project.clientSecret = clientSecret;
        const save = yield project.save();
        req.session.project = save;
        res.status(201).json({
            clientSecret: clientSecret,
        });
        return;
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
exports.generateSecret = generateSecret;
const setProjectHost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = req.project;
        const { host } = req.body;
        if (!host || host.length < 1 || !host.includes('http')) {
            return res.status(400).json({
                error: 'Must include "http" or "https" to be a valid host'
            });
        }
        ;
        if (project.host && project.host === host) {
            return res.sendStatus(201);
        }
        project.host = host;
        const save = yield project.save();
        req.session.project = save;
        res.sendStatus(201);
        return;
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
exports.setProjectHost = setProjectHost;
const addCollaborator = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, permission } = req.body;
    try {
        if (req.session.user && req.session.user.email === email) {
            res.sendStatus(400);
            return;
        }
        if (!req.session.user) {
            res.sendStatus(500);
            return;
        }
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            return res.sendStatus(400);
        }
        const project = req.project;
        user.requests.push({ requestedBy: req.session.user.email, projectName: project.name, permission: permission });
        project.collaborators.push({ userId: user._id, permission: permission, email: user.email });
        yield user.save();
        yield project.save();
        req.session.project = project;
        res.sendStatus(201);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
exports.addCollaborator = addCollaborator;
