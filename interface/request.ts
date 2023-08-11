import express from "express";
import UserModel from "./userModel";
import { Model, Document, Query } from "mongoose"; // Import necessary types

export default interface iRequest extends express.Request {
  token: string | undefined;
  user: Document<unknown> | undefined;
}
