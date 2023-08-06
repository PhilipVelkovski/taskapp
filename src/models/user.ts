/**
 * User model file.
 */
import mongoose, { ConnectOptions, Schema } from "mongoose";
import validator from "validator";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    validate(value: number) {
      if (value < 0) {
        throw new Error("Age must be a positive Number!");
      }
    },
  },
  email: {
    type: String,
    required: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not Valid!");
      }
    },
  },
});

userSchema.statics.generateToken = async () => {
  const user = this;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
