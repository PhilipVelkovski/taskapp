/**
 * Express server.
 * Application entrypoint.
 */
import express from "express";
import Database from "./src/db/mongose";
import userRouter from "./src/routers/user-routes";
import taskRouter from "./src/routers/task-routes";
class ExpressServer {
  protected app: express.Application;
  protected PORT = 3000 || process.env.PORT;
  protected db = new Database();

  constructor() {
    this.app = express();
    this.setUpExpress();
  }

  protected async setUpExpress(): Promise<void> {
    //Parse incoming requests to JSON
    this.app.use(express.json());
    //Use user route handler
    this.app.use(userRouter);
    //Use task route handler
    this.app.use(taskRouter);
  }

  public async startUpServer(): Promise<void> {
    //Set up server and databse connections
    this.app.listen(this.PORT, async () => {
      await this.db.connectDB();
      console.log("Server Started...");
    });
  }
}
const server = new ExpressServer();
server.startUpServer();
