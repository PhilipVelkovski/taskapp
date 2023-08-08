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
 */
const express_1 = __importDefault(require("express"));
const mongose_1 = __importDefault(require("./src/db/mongose"));
const user_routes_1 = __importDefault(require("./src/routers/user-routes"));
const task_routes_1 = __importDefault(require("./src/routers/task-routes"));
const app = (0, express_1.default)();
const port = 3000 || process.env.PORT;
const db = new mongose_1.default();
// Avtomatski parse sekoj request vo json
app.use(express_1.default.json());
app.use(user_routes_1.default);
app.use(task_routes_1.default);
// Set up server and databse
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.connectDB();
    console.log("Server Started");
}));
