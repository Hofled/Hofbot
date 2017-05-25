import { Document } from "mongoose";
import { CommandData } from "../";

export interface ICommandData extends CommandData, Document {

}