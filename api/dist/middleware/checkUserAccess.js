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
const Project_1 = __importDefault(require("../models/Project"));
const checkUserAccess = (key, checkSession) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (key === 'project') {
            try {
                const { projectId } = req.params;
                if (!projectId || projectId.length < 1 || !req.userId || req.userId.length < 1) {
                    return res.sendStatus(400);
                }
                if (checkSession && req.session.project && req.session.project._id === projectId) {
                    const projectSessionUserId = req.session.project.ownerId.toString();
                    if (projectSessionUserId !== req.userId) {
                        res.sendStatus(403);
                        return;
                    }
                    res.status(200).json(Object.assign({}, req.session.project));
                    return;
                }
                const project = yield Project_1.default.findById(projectId);
                if (!project) {
                    return res.sendStatus(500);
                }
                const projectUserId = project.ownerId.toString();
                if (projectUserId !== req.userId.toString()) {
                    return res.sendStatus(403);
                }
                req.project = project;
                next();
            }
            catch (e) {
                res.sendStatus(500);
                return;
            }
        }
    });
};
exports.default = checkUserAccess;
