import { UserData } from '../../definitions/user-data';

export class User {
    data: UserData;

    constructor(data: UserData) {
        this.data = data;
    }
}