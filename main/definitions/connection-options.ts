export class TmiOptions {
    options: {
        debug: boolean
    };

    connection: {
        reconnect: boolean
    };

    identity: {
        username: string,
        password: string
    };

    channels: string[];

    /**Creates an options object which the tmi.js API uses
     * @constructor
     * 
     * @param {boolean} debug Show API output to console.
     * @param {boolean} reconnect Retry reconnect in case connection was lost.
     * @param {string} username The username of the bot's account.
     * @param {string} authKey The authentication key provided by twitch for the account.
     * @param {string[]} channels The channels of which you want the bot to connect to.
     */
    constructor(debug: boolean, reconnect: boolean, username: string, authKey: string, channels: string[]) {
        this.options = { debug: debug };
        this.connection = { reconnect: reconnect };
        this.identity = { username: username, password: authKey };
        this.channels = channels;
    }
}