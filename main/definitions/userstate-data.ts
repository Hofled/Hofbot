import { MessageType } from "./index"

/**
 * Defines the structure of the userstate data object retreived when message events are raised.
 */
export class UserState {
    badges: { type: number, description: string };
    color: string;
    displayName: string;
    emotes: { [key: number]: string[] };
    mod: boolean;
    roomId: number;
    subscriber: boolean;
    turbo: boolean;
    userId: number;
    userType: string;
    emotesRaw: string;
    badgesRaw: string;
    username: string;
    messageType: MessageType;

    constructor(userstateObj) {
        this.badges = userstateObj.badges;
        this.color = userstateObj.color;
        this.displayName = userstateObj['display-name'];
        this.emotes = userstateObj.emotes;
        this.mod = userstateObj.mod;
        this.roomId = userstateObj['room-id'];
        this.subscriber = userstateObj.subscriber;
        this.turbo = userstateObj.turbo;
        this.userId = userstateObj['user-id'];
        this.userType = userstateObj['user-type'];
        this.emotesRaw = userstateObj['emotes-raw'];
        this.badgesRaw = userstateObj['badges-raw'];
        this.username = userstateObj.username;

        let msgTypeString: string = userstateObj['message-type'];
        this.messageType = MessageType[msgTypeString];
    }
}