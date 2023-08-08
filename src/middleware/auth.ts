import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
export const auth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    //@ts-ignore
    const decoded = jwt.verify(token, "thisismynewcourse");
    // Find User with given id
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("No user found");
    }
    //@ts-ignore
    req.token = token;
    //@ts-ignore
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
