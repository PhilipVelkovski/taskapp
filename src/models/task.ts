/**
 * Task model.
 */

import mongoose, { ConnectOptions, Schema } from "mongoose";

const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  acomplished: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
