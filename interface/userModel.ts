import { Model } from "mongoose";

// Define an interface for the User model with the added findByCredentials method
export default interface UserModel extends Model<Document> {
  findByCredentials(email: string, password: string): Promise<Document | null>;
}
