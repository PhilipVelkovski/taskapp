"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = void 0;
/**
 * User model.
 */
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const task_1 = require("./task");
const userSchema = new mongoose_1.Schema({
    name: {
        // Type of data
        type: String,
        // Is it required for the model
        required: true,
        // Trim remove whitespace
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("Email is not valid!");
            }
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLocaleLowerCase().includes("password")) {
                throw new Error('Password cannot contain "password"');
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        // Validate model
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive Number!");
            }
        },
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
// Virtual Property
userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner",
});
// Model Middlewares
/**
 * Middleware (also called pre and post hooks)
 * are functions which are passed control during execution of
 * asynchronous functions.
 * Mongoose has 4 types of middleware: document middleware,
 *  model middleware, aggregate middleware, and query middleware.
 */
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, "thisismynewcourse");
        user.tokens = user.tokens.concat({ token });
        yield user.save();
        return token;
    });
};
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};
// findByCredentials
userSchema.statics.findByCredentials = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield exports.User.findOne({ email });
    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
});
// Hash password before saving to database.
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // this - Document that is going to be saved.
        const user = this;
        // Hash users password
        if (user.isModified("password")) {
            user.password = yield bcryptjs_1.default.hash(user.password, 8);
        }
        next();
    });
});
// Delete user and users tasks.
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // this - Document that is going to be saved.
        const user = this;
        task_1.Task.deleteMany({
            owner: user._id,
        });
        next();
    });
});
// Export user model
exports.User = mongoose_1.default.model("User", userSchema);
// module.exports = User;
