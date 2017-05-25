import * as tmi from 'tmi.js';
import { TmiOptions } from '../../definitions/connection-options';

export class MessageSender {
    private client: tmi.client;
    private clientOptions: TmiOptions;

    constructor(client: tmi.client, options: TmiOptions) {
        this.client = client;
        this.clientOptions = options;
    }

    /**Broadcasts a message across all connected channels */
    broadcastMessage(message: string) {
        this.clientOptions.channels.
            forEach((channel) => this.sendMessage(channel.substr(1), message));
    }

    /**Sends a message to the specified channel */
    sendMessage(channelName: string, message: string) {
        if (message) {
            this.client.say(channelName, message);
        }
    }

    /**Sends a whisper to the specified user */
    sendWhisper(userName: string, message: string) {
        this.client.whisper(userName, message);
    }
}