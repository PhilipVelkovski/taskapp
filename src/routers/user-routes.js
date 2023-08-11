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
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const sharp_1 = __importDefault(require("sharp"));
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
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    dest: "avatar",
    limits: {
        fileSize: 100000,
    },
    fileFilter(req, file, cb) {
        // Check if file is a Pdf
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error("Please upload an image"));
        }
        //@ts-ignore
        cb(undefined, true);
    },
});
// Upload an avatar
router.post("/users/me/avatar", auth_1.auth, 
//@ts-ignore
upload.single("avatar"), 
//@ts-ignore
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send();
    }
    console.log("JSON " + JSON.stringify(req.file));
    const buffer = yield (0, sharp_1.default)(req.file.buffer)
        .resize({
        width: 250,
        height: 250,
    })
        .png()
        .toBuffer();
    //@ts-ignore
    req.user.avatar = buffer;
    //@ts-ignore
    yield req.user.save();
    res.send();
}), 
//@ts-ignore
(error, req, res, next) => {
    res.status(400).send({ error: error.message });
});
router.delete("users/me/avatar", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    req.user.avatar = undefined;
    //@ts-ignore
    yield req.user.save();
    res.send();
}));
router.get("/users/:id/avatar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.params.id " + req.params.id);
        const user = yield user_1.User.findById(req.params.id);
        console.log("User " + JSON.stringify(user));
        if (!user || !(user === null || user === void 0 ? void 0 : user.avatar)) {
            throw new Error("No user founds");
        }
        res.set("Content-Type", "image/jpg");
        res.send(user.avatar);
    }
    catch (error) {
        //
        res.status(404).send();
    }
}));
// Export Module
exports.default = router;
