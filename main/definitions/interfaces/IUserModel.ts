import { Document } from "mongoose";
import { IUser } from "./IUser";

export interface IUserModel extends IUser, Document {

}