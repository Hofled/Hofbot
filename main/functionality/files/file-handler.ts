import * as jsonfile from 'jsonfile';

export class FileHandler {
    writeObjToFileSync(object: any, filePath: string, checkExists: boolean = false) {
        let options = { flag: 'w' };

        if (checkExists) {
            options.flag = 'wx';
        }
        try {
            jsonfile.writeFileSync(filePath, object, options);
        }
        catch (err) {
            console.log('error in writing to ' + filePath + ": already exists");
        }
    }

    readFileSync(filePath: string): any {
        return jsonfile.readFileSync(filePath, 'utf8');
    }
}