import { Model } from "mongoose";

export default interface UserModel extends Model<Document> {
  findByCredentials(email: string, password: string): Promise<Document | null>;
}
