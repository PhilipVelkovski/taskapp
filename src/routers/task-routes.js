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
const task_1 = require("../models/task");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router(); // Create an instance of Express Router
// Creatinal Endpoints
router.post("/tasks", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const task = new Task(req.body);
    const task = new task_1.Task(Object.assign(Object.assign({}, req.body), { 
        //@ts-ignore
        owner: req.user._id }));
    try {
        yield task.save();
        res.status(201).send(task);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
// Reading Endpoints
router.get("/tasks", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_1.Task.find({
            //@ts-ignore
            owner: req.user._id,
        });
        res.send(tasks);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
//
router.get("/tasks/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    try {
        //@ts-ignore
        const task = yield task_1.Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}));
// Updating Endpoints
router.patch("/tasks/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Proveri dali se validni polinjata na modelot shto sakame da gi updateneme
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOpperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });
    if (!isValidOpperation) {
        return res.status(400).send({ error: "Invalid Updates!" });
    }
    try {
        const task = yield task_1.Task.findOne({
            _id: req.params.id,
            //@ts-ignore
            owner: req.user._id,
        });
        // Type the user model
        const typedTask = task;
        updates.forEach((update) => {
            typedTask[update] = req.body[update];
        });
        yield (task === null || task === void 0 ? void 0 : task.save());
        // Koristeno na samiot model
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //   // Setiraj go kako nov
        //   new: true,
        //   // Neka se validira spored model validation
        //   runValidators: true,
        // });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
// Deleting routes
router.delete("/tasks/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_1.Task.findOneAndDelete({
            _id: req.params.id,
            //@ts-ignore
            owner: req.user._id,
        });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch (error) {
        return res.status(500).send();
    }
}));
exports.default = router;
