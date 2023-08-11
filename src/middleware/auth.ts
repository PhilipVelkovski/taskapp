import express from "express";
import { RequestHandler } from "express";

import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { User } from "../models/user";
import iRequest from "../../interface/request";
//@ts-ignore
export const auth: RequestHandler<iRequest> = async (
  req: iRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const token: string | undefined = req
      .header("Authorization")
      ?.replace("Bearer ", "");

    const decoded: JwtPayload | string = jwt.verify(
      token as string,
      process.env.JWT_SECRET as Secret
    );
    // Find User with given id
    const user = await User.findOne({
      //@ts-ignore
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error("No user found");
    }

    req.token = token;

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
