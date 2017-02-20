import * as fs from 'fs';
import * as moment from 'moment';

export class ErrorLogger {
    private static readonly errorFolderPath: string = "logs/errors/";

    /**
     * Writes the error into the log file.
     * @param {string} errorMessage the error message to write to the file.
     * @param {string} fileName the name of the error file to write to.
     */
    static error(errorMessage: string, fileName: string) {
        let formattedError = `${moment()} : [ERROR] - ${errorMessage}` + "\n";
        fs.writeFile(this.errorFolderPath + fileName, formattedError, { flag: 'a' }, err => {
            if (err) console.log(err);
        })
    }
}