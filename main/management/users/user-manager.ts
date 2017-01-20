import * as http from 'http';
import { Observable } from 'rxjs';
import { UserData } from '../../definitions/user-data';
import { User } from '../users/user';
import { FileHandler } from '../../functionality/files/index';

export class UserManager {
    private fileHandler: FileHandler;
    private readonly usersFile: string = 'main/management/users/storage/users_';

    constructor(fileHandler: FileHandler) {
        this.fileHandler = fileHandler;
    }

    getUser(userName: string, users: any): User {
        if (!this.checkUserExists(userName, users)) {
            return new User(new UserData(userName));
        };

        return users[userName.toLowerCase()];
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

    updateUsersFile(users: any, channelName: string) {
        this.fileHandler.writeObjToFileSync(users, this.usersFile + channelName + '.json');
    }

    getLatestUsers(channelName: string): any {
        return this.fileHandler.readFileSync(this.usersFile + channelName + '.json');
    }

    private checkUserExists(userName: string, users: any): boolean {
        return (userName in users);
    }

    /**Generates a new json file for tracking in the spcecific channel, only if the file does not exist already*/
    genNewChannelUsers(channel: string) {
        this.fileHandler.writeObjToFileSync({}, this.usersFile + channel + '.json', true)
    }
}