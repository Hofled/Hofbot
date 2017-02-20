import * as fs from 'fs';

import { ErrorLogger } from '../logging/index';

export class BackupManager {
    private readonly backupFolder: string;
    private readonly errorsFileName: string;

    constructor() {
        this.backupFolder = "backups/";
        this.errorsFileName = "backup-errors.txt";
    }

    /**Starts the interval for backing up files of a specific extension
     * @param {number} intervalTime Interval in seconds
     */
    startBackupInterval(intervalTime: number, folder: string, extension: string) {
        let id = setInterval(() => this.backupFiles(extension, folder), intervalTime * 1000);
    }

    /** Backups the files of the given extention to the backups folder.
     * 
     */
    private backupFiles(fileExtension: string, folder: string) {
        fs.readdir(folder, (err, list) => {
            if (err) {
                ErrorLogger.error(`${err.name}: ${err.message}`, this.errorsFileName);
                return;
            }
            let regex = new RegExp("/^\." + fileExtension + "$/");
            list.map((file) => regex.test(file) ? file : null);
            list.forEach((file) => {
                try {
                    fs.createReadStream(folder + "/" + file).pipe(fs.createWriteStream(this.backupFolder + "backup_" + file));
                }
                catch (err) {
                    ErrorLogger.error(err, this.errorsFileName);
                }
            })
        })
    }
}