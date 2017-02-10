import * as lowdb from 'lowdb';

export class DataBaseGenerator {
    private readonly usersStoragePath: string = "main/management/users/storage/users_";

    generateUsersDB(channelName: string) {
        new lowdb(this.usersStoragePath + channelName + ".json").defaults({ users: [] }).value();
    }
}