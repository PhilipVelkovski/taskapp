/**
 * Request Interface.
 */
import express from "express";
import { Document } from "mongoose";

export default interface iRequest extends express.Request {
  token: string | undefined;
  user: Document<unknown> | undefined;
}
