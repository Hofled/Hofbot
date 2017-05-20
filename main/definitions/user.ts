import { UserData } from './';
import { IUser } from "./interfaces/IUser";

export class User implements IUser {
    data: UserData;

    constructor(data: UserData) {
        this.data = data;
    }
}