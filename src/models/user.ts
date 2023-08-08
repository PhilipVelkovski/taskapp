/**
 * User model.
 */
import mongoose, { ConnectOptions, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Task } from "./task";

const userSchema = new Schema(
  {
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
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value: string) {
        if (value.toLocaleLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      // Validate model
      validate(value: number) {
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
  },
  {
    timestamps: true,
  }
);
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
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewcourse");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// findByCredentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};
// Hash password before saving to database.
userSchema.pre("save", async function (next) {
  // this - Document that is going to be saved.
  const user = this;
  // Hash users password
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Delete user and users tasks.
userSchema.pre("save", async function (next) {
  // this - Document that is going to be saved.
  const user = this;
  Task.deleteMany({
    owner: user._id,
  });
  next();
});

// Export user model
export const User = mongoose.model("User", userSchema);
// module.exports = User;
