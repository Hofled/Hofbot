import * as lowdb from 'lowdb';

export class DataBaseManager {
    constructor(dbPath: string, private db = new lowdb(dbPath)) {
    }

    /** Used to find a specific value within an array entry
     */
    findValue<T>(arrayPath: string, predicate: any): T {
        return this.db.get(arrayPath).find(predicate).value<T>();
    }

    /** Assings a value to the specified array key using the specified predicate and value
     * @param {any} predicate the predicate to use for finding the required entries
     * @param {any} value the key and value to set in the specified entry, can use the format: {objectKey: newValue}
     */
    assignValue(arrayPath: string, predicate: any, value: any) {
        this.db.get(arrayPath).find(predicate).assign(value).value();
    }

    /** Removes all objects that satisfy the predicate value from the specified fieldPath,
     * currently only supports removal from fields which are of type array.
     * @param {string} arrayPath the path to the key of type Array.
     * @param {any} predicate the object to satisfy the predicate's condition
     */
    removeValue(arrayPath: string, predicate: any) {
        this.db.get(arrayPath).remove(predicate).value();
    }

    /** Pushes a value into the array field in the db.
     * @param {string} arrayKey the key which holds the array of values
     * @param {any} valueToPush the value to push into the array
     */
    pushValue(arrayKey: string, valueToPush: any) {
        this.db.get(arrayKey).push(valueToPush).value();
    }

    /** Checks if the specified field exists in the db. 
     * @param {string} fieldPath the field to check using the dot notation such as: key.subkey
    */
    checkHas(fieldPath: string): boolean {
        return this.db.hasIn(fieldPath).value<boolean>();
    }
    
    /** Returns the entire DB in its current state */
    getEntireDB(): any {
        this.db.getState();
    }

    /** Sets a specific value from the db.
     * @param {string} fieldPath Search parameter specified in the format of a JSON object such as: key.subkey
     * @param {any} value value to set the specified field with
     */
    setValue(fieldPath: string, value: any) {
        this.db.set(fieldPath, value).value();
    }

    /** Gets a specific value from the db.
     * @param {string} fieldPath Search parameter specified in the format of a JSON object such as: key.subkey
     */
    getValue<T>(fieldPath: string): T {
        return this.db.get(fieldPath).value<T>();
    }
}