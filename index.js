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
/**
 * Express server.
 * Application entrypoint.
 */
const express_1 = __importDefault(require("express"));
const mongose_1 = __importDefault(require("./src/db/mongose"));
const user_routes_1 = __importDefault(require("./src/routers/user-routes"));
const task_routes_1 = __importDefault(require("./src/routers/task-routes"));
class ExpressServer {
    constructor() {
        this.PORT = 3000 || process.env.PORT;
        this.db = new mongose_1.default();
        this.app = (0, express_1.default)();
        this.setUpExpress();
    }
    setUpExpress() {
        return __awaiter(this, void 0, void 0, function* () {
            //Parse incoming requests to JSON
            this.app.use(express_1.default.json());
            //Use user route handler
            this.app.use(user_routes_1.default);
            //Use task route handler
            this.app.use(task_routes_1.default);
        });
    }
    startUpServer() {
        return __awaiter(this, void 0, void 0, function* () {
            //Set up server and databse connections
            this.app.listen(this.PORT, () => __awaiter(this, void 0, void 0, function* () {
                yield this.db.connectDB();
                console.log("Server Started...");
            }));
        });
    }
}
const server = new ExpressServer();
server.startUpServer();
