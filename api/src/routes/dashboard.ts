import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongodb-session';

import { createProject, getProject, getProjects, removeProject, generateSecret, setProjectHost, addCollaborator } from '../controllers/dashboard';

import authRoutes from './auth';
import auth from '../middleware/isAuth';
import isStored from '../middleware/isStored';
import checkUserAccess from '../middleware/checkUserAccess';
import { ProjectInterface } from '../types/dashboard';

const router = express.Router();
const MongoDBStore = MongoStore(session);

const store = new MongoDBStore({
    uri: `${process.env.MONGODB_URI}`,
    collection: 'dashboard-sessions',
})

const dashboardSession = session({
    secret: 'testing',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 12 * 60 * 60 * 1000,   
    },
    store: store,
    
})

declare module 'express-session' {
    interface SessionData {
      authSecret: string,
      projects: any[];
      project: ProjectInterface;
      user: { id: string, email: string };
    }
}

router.use(dashboardSession);

router.use('/auth', authRoutes);

router.use(auth('authenticated'));

router.post('/create', createProject);
router.get('/projects', isStored('projects'), getProjects);

router.get('/project/:projectId', checkUserAccess('project', true), getProject);
router.put('/project/:projectId/generate-secret', checkUserAccess('project', false), generateSecret);
router.put('/project/:projectId/set-host', checkUserAccess('project', false), setProjectHost)
router.delete('/project/:projectId/remove', checkUserAccess('project', false), removeProject)

router.put('/project/:projectId/collaborators', checkUserAccess('project', false), addCollaborator);
router.delete('/project/:projectId/collaborators', checkUserAccess('project', false));

export default router;