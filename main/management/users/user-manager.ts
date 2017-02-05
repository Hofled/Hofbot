import * as http from 'http';
import * as lowdb from 'lowdb';
import { Observable } from 'rxjs';

import { UserData } from '../../definitions/user-data';
import { User } from '../users/user';
import { DataBaseManager } from '../../functionality/db/index';

export class UserManager {
    private dbManager: DataBaseManager;
    private readonly usersFile: string = 'main/management/users/storage/users_';

    constructor(channelName: string) {
        this.dbManager = new DataBaseManager(this.usersFile + channelName + ".json");
    }

    getUser(userName: string): User {
        if (!this.checkUserExists(userName)) {
            return new User(new UserData(userName));
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

    userHasValue(userField: string, userName: string): boolean {
        return this.dbManager.checkHas(userField, { parentKey: 'users', predicate: (user) => user[userName] !== undefined });
    }

    /** Updates the user data entry in the db with the passed user data */
    updateUserData(userName: string, userData: UserData) {
        this.dbManager.assignValue('users', (userItem) => userItem[userName] !== undefined, { userName: { data: userData } });
    }

    getAllUsers(): any {
        return this.dbManager.getEntireDB();
    }

    private checkUserExists(userName: string): boolean {
        return this.dbManager.checkHas(userName, { parentKey: 'users', predicate: (userItem) => userItem[userName] !== undefined });
    }
}