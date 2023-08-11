/**
 * Database file.
 * start mongoDb exec
 * // .\mongodb\bin\mongod.exe --dbpath=.\mongodb-data
 */
import mongoose from "mongoose";

export default class Database {
  public async connectDB(): Promise<void> {
    //@ts-ignore
    mongoose.connect(process.env.MONGODB_URL);
  }
}
