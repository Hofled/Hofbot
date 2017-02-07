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

    getUserData(userName: string): UserData {
        if (!this.checkUserExists(userName)) {
            let newUser = new User(new UserData(userName));
            let tempUser = {};
            tempUser[userName] = newUser;
            this.dbManager.pushValue('users', tempUser);
            return newUser.data;
        };

        let users = this.dbManager.getValue('users') as any[];
        let userIndex = users.findIndex(user => user[userName] !== undefined);
        let searchQuery = ['users', userIndex, userName];

        let user = this.dbManager.querySearch<User>(searchQuery);
        return user.data;
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
        let users = this.dbManager.getValue('users') as any[];
        let userIndex = users.findIndex(userWrappr => userWrappr[userName] !== undefined);
        let searchQuery = ['users', userIndex, userName];
        this.dbManager.assignValue('users', searchQuery, { data: userData });
    }

    getAllUsers(): any {
        return this.dbManager.getEntireDB();
    }

    private checkUserExists(userName: string): boolean {
        return this.dbManager.findValue('users', (user) => user[userName] !== undefined) !== undefined;
    }
}