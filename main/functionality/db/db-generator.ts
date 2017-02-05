import * as fs from 'fs';

export class DataBaseGenerator {
    private readonly usersStoragePath: string = "main/management/users/storage/users_";

    generateUsersDB(channelName: string) {
        let options = { flag: 'wx' };

        try {
            fs.writeFileSync(this.usersStoragePath + channelName + ".json", {}, options);
        }
        catch (err) {
            console.log('error in generating ' + this.usersStoragePath + channelName + ".json");
        }
    }
}