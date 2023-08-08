/**
 * Database file.
 * start mongoDb exec
 * // .\mongodb\bin\mongod.exe --dbpath=.\mongodb-data
 */
import mongoose from "mongoose";

export default class Database {
  public async connectDB(): Promise<void> {
    mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");
  }
}
