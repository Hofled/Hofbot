import * as http from 'http';
import * as lowdb from 'lowdb';
import { Observable } from 'rxjs';
import { TaskSequencer } from "task-sequencer";

import { UserData, User } from '../../definitions';
import { IUserData } from "../../definitions/interfaces/IUserData";
import { DataBaseManager } from '../../functionality/db/index';

export class UserManager {
    private dbManager: DataBaseManager;
    private taskSequencer: TaskSequencer;

    constructor(channelName: string) {
        this.dbManager = new DataBaseManager(channelName);
        this.taskSequencer = new TaskSequencer();
    }

    /**
     * Async method to fetch a user instance from the DB.
     * NOTE - 'this' context is unreachable from callback.
     * @param userName The username of the desired user
     * @param cb A callback function which will be called with the user object after it has been fetched from the DB
     */
    getUserData(userName: string, cb: (userData: IUserData) => void): void {
        let completeObservables = this.taskSequencer.task(this.dbManager, this.dbManager.getUser, [userName]);
        completeObservables.done.subscribe((userData: IUserData) => {
            if (!userData) {
                let newUser = new User(new UserData(userName));
                userData = <IUserData>newUser.data;
                Observable.fromPromise(this.dbManager.registerUser(newUser)).subscribe(
                    (savedData) => {
                        cb(savedData);
                    },
                    err => {
                        console.log(`rejected promise in registerUser with error: ${err}`);
                    });
            }
            else {
                cb(userData);
            }
        });

        completeObservables.reject.subscribe((reject) => {
            console.log(`got a reject reason of: ${reject}`)
        })
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
        this.dbManager.updateUser(userName, userData);
    }
}