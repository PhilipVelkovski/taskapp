/**
 * Database file.
 * start mongoDb exec
 * // .\mongodb\bin\mongod.exe --dbpath=.\mongodb-data
 */
import mongoose, { ConnectOptions, Schema } from "mongoose";
import validator from "validator";
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");
