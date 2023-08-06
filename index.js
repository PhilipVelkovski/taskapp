"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Express server.
 */
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000 || process.env.PORT;
app.listen(port, () => {
    console.log("Server Started");
});
