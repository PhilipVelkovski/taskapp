/**
 * Express server.
 */
import express from "express";
import database from "./src/db/mongose";
import userRouter from "./src/routers/user-routes";
import taskRouter from "./src/routers/task-routes";
import jwt from "jsonwebtoken";
const app = express();

const port = 3000 || process.env.PORT;
const db = new database();

// Avtomatski parse sekoj request vo json
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// Set up server and databse
app.listen(port, async () => {
  await db.connectDB();

  console.log("Server Started");
});
