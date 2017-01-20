import { UserState } from "../definitions/userstate-data";
import * as moment from 'moment';

/**
 * A class that defines the structure of the data that is received uppon a message event in the client.
 */
export class MessageData {
    channelName: string;
    userState: UserState;
    message: string;
    self: boolean;
    messageTime: moment.Moment;

    constructor(channel: string, userState: any, message: string, self: boolean) {
        this.channelName = channel.substr(1);
        this.userState = new UserState(userState);
        this.message = message;
        this.self = self;
        this.messageTime = moment();
    }
}