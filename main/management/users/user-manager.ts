import * as http from 'http';
import * as lowdb from 'lowdb';
import { Observable } from 'rxjs';

import { UserData, User } from '../../definitions';
import { DataBaseManager } from '../../functionality/db/index';

export class UserManager {
    private dbManager: DataBaseManager;
    private readonly usersFile: string = 'main/management/users/storage/users_';

    constructor(channelName: string) {
        this.dbManager = new DataBaseManager(this.usersFile + channelName + ".json");
    }

    getUser(userName: string): User {
        if (!this.checkUserExists(userName)) {
            let newUser = new User(new UserData(userName));
            this.dbManager.pushValue('users', newUser);
            return newUser;
        };

        return this.dbManager.findValue<User>('users', (user) => user[userName] !== undefined);
    }

    getCurrentViewers(channel: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            http.get('http://tmi.twitch.tv/group/user/' + channel + '/chatters', (res) => {
                res.setEncoding('utf8');
                let currentUsers = '';
                res.on('data', (data) => {
                    currentUsers += data;
                });
                res.on('end', () => {
                    resolve(JSON.parse(currentUsers)['chatters']);
                });
            });
        });
    }

    /** Updates the user data entry in the db with the passed user data */
    updateUserData(userName: string, userData: UserData) {
        this.dbManager.assignValue('users', (userItem) => userItem[userName] !== undefined, { userName: { data: userData } });
    }

    getAllUsers(): any {
        return this.dbManager.getEntireDB();
    }

    private checkUserExists(userName: string): boolean {
        return this.dbManager.findValue('users', (user) => { user[userName] !== undefined }) !== undefined;
    }
}