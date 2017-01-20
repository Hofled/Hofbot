import * as fs from 'fs';
import * as path from 'path';

export class BackupManager {
    private readonly backupFolder: string = "backups/";

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
                return;
            }
            let regex = new RegExp("/^\." + fileExtension + "$/");
            list.map((file) => regex.test(file) ? file : null)
            list.forEach((file) => {
                fs.createReadStream(folder + "/" + file).pipe(fs.createWriteStream(this.backupFolder + file));
            })
        })
    }
}