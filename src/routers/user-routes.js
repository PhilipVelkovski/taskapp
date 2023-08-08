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
 * User Routes.
 */
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router(); // Create an instance of Express Router
// Creatinal Endpoints
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_1.User(req.body);
    try {
        yield user.save();
        // @ts-ignore
        const token = yield user.generateAuthToken();
        res.status(201).send({ user, token });
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
// Login route
router.post("/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = yield user_1.User.findByCredentials(req.body.email, req.body.password);
        const token = yield user.generateAuthToken();
        res.send({ user, token });
    }
    catch (error) {
        res.status(400).send();
    }
}));
// Log out route
router.post("/users/logout", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        req.user.tokens = req.users.tokens.filter((token) => {
            //@ts-ignore
            return token.token !== req.token;
        });
        //@ts-ignore
        yield req.user.save();
        res.send();
    }
    catch (error) {
        res.status(500).send();
    }
}));
// Log out route
router.post("/users/logoutAll", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        req.user.tokens = [];
        //@ts-ignore
        yield req.user.save();
        res.send();
    }
    catch (error) {
        res.status(500).send();
    }
}));
// Reading Endpoints
router.get("/users/me", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    res.send(req.user);
}));
// Updating Endpoints
router.patch("/users", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Proveri dali se validni polinjata na modelot shto sakame da gi updateneme
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "password", "email", "age"];
    const isValidOpperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });
    if (!isValidOpperation) {
        return res.status(400).send({ error: "Invalid Updates!" });
    }
    try {
        // Instance of the user model
        //@ts-ignore
        const user = req.user;
        // Type the user model
        const typedUser = user;
        updates.forEach((update) => {
            typedUser[update] = req.body[update];
        });
        //@ts-ignore
        yield ((_a = req.user) === null || _a === void 0 ? void 0 : _a.save());
        if (!user) {
            return res.status(404).send();
        }
        //@ts-ignore
        res.send(req.user);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Deleting routes
router.delete("/users/me", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        yield req.user.remove();
        //@ts-ignore
        res.send(req.user);
    }
    catch (error) {
        return res.status(500).send();
    }
}));
// Export Module
exports.default = router;
