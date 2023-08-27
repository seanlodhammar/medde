"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiSession = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const api_1 = require("../controllers/api");
const isAuthorized_1 = __importDefault(require("../middleware/isAuthorized"));
const isCustomer_1 = __importDefault(require("../middleware/isCustomer"));
const router = express_1.default.Router();
const MongoDBStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
router.post('/authorize', api_1.createAccessToken);
const store = new MongoDBStore({
    uri: `${process.env.MONGODB_URI}`,
    collection: 'api-sessions',
});
exports.apiSession = (0, express_session_1.default)({
    secret: `${process.env.SESSION_SECRET}`,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 12 * 60 * 60 * 1000,
    },
    store: store,
});
router.use(exports.apiSession);
router.use(isAuthorized_1.default);
router.post('/create-customer', api_1.createCustomer);
router.post('/create-support-request', isCustomer_1.default, api_1.createSupportRequest);
exports.default = router;
