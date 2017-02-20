import * as http from 'http';
import * as lowdb from 'lowdb';
import { Observable } from 'rxjs';

import { UserData } from '../../definitions/user-data';
import { User } from '../users/user';
import { DataBaseManager } from '../../functionality/db/index';
import { ErrorLogger } from '../../functionality/logging/index';

export class UserManager {
    private dbManager: DataBaseManager;
    private readonly usersKey: string;
    private readonly usersFile: string;
    private readonly errorsFileName: string;

    constructor(channelName: string) {
        this.usersKey = 'users';
        this.usersFile = 'main/management/users/storage/users_';
        this.errorsFileName = "user-manager-errors.txt";
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
            http.get('http://tmi.twitch.tv/groasdser/' + channel + '/chatters', (res) => {
                res.setEncoding('utf8');
                let currentUsers = '';

                res.on('data', (data) => {
                    currentUsers += data;
                });

                res.on('end', () => {
                    try {
                        let chatters = JSON.parse(currentUsers)['chatters'];
                        resolve(chatters);
                    }
                    catch (err) {
                        ErrorLogger.error(err, this.errorsFileName);
                    }
                });

            }).on('error', err => {
                ErrorLogger.error(`${err.name}: ${err.message}`, this.errorsFileName);
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

    /** Returns the entire DB of the users */
    getAllUsers(): any {
        return this.dbManager.getEntireDB();
    }

    updateAllUsers(users: any) {
        this.dbManager.setValue(this.usersKey, users);
    }

    checkUserExists(userName: string): boolean {
        return this.dbManager.findValue('users', (user) => user[userName] !== undefined) !== undefined;
    }
}