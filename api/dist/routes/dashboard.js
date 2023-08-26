"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const dashboard_1 = require("../controllers/dashboard");
const auth_1 = __importDefault(require("./auth"));
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const isStored_1 = __importDefault(require("../middleware/isStored"));
const checkUserAccess_1 = __importDefault(require("../middleware/checkUserAccess"));
const router = express_1.default.Router();
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new MongoDBStore({
    uri: 'mongodb+srv://sean:GetOO44B2jXgSXTS@testcluster.cfgo7qm.mongodb.net/medde',
    collection: 'dashboard-sessions',
});
const dashboardSession = (0, express_session_1.default)({
    secret: 'testing',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 12 * 60 * 60 * 1000,
    },
    store: store,
});
router.use(dashboardSession);
router.use('/auth', auth_1.default);
router.use((0, isAuth_1.default)('authenticated'));
router.post('/create', dashboard_1.createProject);
router.get('/projects', (0, isStored_1.default)('projects'), dashboard_1.getProjects);
router.get('/project/:projectId', (0, checkUserAccess_1.default)('project', true), dashboard_1.getProject);
router.put('/project/:projectId/generate-secret', (0, checkUserAccess_1.default)('project', false), dashboard_1.generateSecret);
router.put('/project/:projectId/set-host', (0, checkUserAccess_1.default)('project', false), dashboard_1.setProjectHost);
router.delete('/project/:projectId/remove', (0, checkUserAccess_1.default)('project', false), dashboard_1.removeProject);
router.put('/project/:projectId/collaborators', (0, checkUserAccess_1.default)('project', false), dashboard_1.addCollaborator);
router.delete('/project/:projectId/collaborators', (0, checkUserAccess_1.default)('project', false));
exports.default = router;
