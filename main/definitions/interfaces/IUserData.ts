import { Document } from "mongoose";
import { UserData } from "../";

export interface IUserData extends UserData, Document{

}