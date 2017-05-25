import * as tmi from 'tmi.js';
import * as fs from 'fs';

import { MessageSender } from '../functionality/messages/index';
import { MessageData, MessageType, TmiOptions, Channel } from '../definitions/index';
import { CommandHandler } from '../management/commands/index';
import { DataBaseManager, DataBaseGenerator } from '../functionality/db/index';
import { CasinoManager } from '../management/casino/index';
import { SettingsManager } from '../bot-settings/index';
import { UserManager } from '../management/users/user-manager';
import { CooldownManager } from '../management/cooldown/cooldown-manager';
import { PermissionValidator } from '../functionality/permissions/index';
import { BackupManager } from '../functionality/backup/index';

export class BotConnection {
    private client: tmi.client;
    private tmiOptions: TmiOptions;
    private channels: Channel[];
    private messageSender: MessageSender;
    private commandHandler: CommandHandler;
    private casinoManager: CasinoManager;
    private backupManager: BackupManager;
    private dbGenerator: DataBaseGenerator;
    private welcomeMessage: string;

    constructor(options) {
        this.tmiOptions = options;
        this.client = new tmi.client(this.tmiOptions);
        this.channels = [];
        this.messageSender = new MessageSender(this.client, this.tmiOptions);
        let settingsManager = new SettingsManager();
        this.dbGenerator = new DataBaseGenerator();
        let cooldownManager = new CooldownManager(settingsManager, this.tmiOptions.channels);
        this.backupManager = new BackupManager();

        this.welcomeMessage = `Hello! KAPOW I am ${this.tmiOptions.identity.username} MrDestructoid`;

        this.backupManager.startBackupInterval(1800, "main/management/users/storage", "json");

        this.generateChannels(this.client, this.tmiOptions, settingsManager, cooldownManager);

        // Starting to listen on messages received in the chats the client is connected to.
        this.listenToConnection(this.channels);
    }

    private genChannelDB(channelName: string, tmiOptions: TmiOptions) {
        tmiOptions.channels.forEach((channel) => {
            this.dbGenerator.generateUsersDB(channel.substr(1));
        });
    }

    private generateChannels(client: tmi.client, tmiOptions: TmiOptions, settingsManager: SettingsManager, cooldownManager: CooldownManager) {
        tmiOptions.channels.forEach(channel => {
            this.channels.push(new Channel(channel.substr(1), client, this.tmiOptions, settingsManager, cooldownManager));
            this.genChannelDB(channel, tmiOptions);
        });
    }

    private listenToConnection(channels: Channel[]) {

        this.client.on("message", function (channel, userstate, message, self) {

            let messageData = new MessageData(channel, userstate, message, self);

            if (messageData.self) return;

            switch (messageData.userState.messageType) {
                case MessageType.action:
                    channels.find((channel) => channel.name == messageData.channelName).handleMessage(messageData);
                    break;
                case MessageType.chat:
                    channels.find((channel) => channel.name == messageData.channelName).handleMessage(messageData);
                    break;
                case MessageType.whisper:
                    // Ignore whispers for now.
                    break;
                default:
                    break;
            }
        });
    }

    connect() {
        this.client.connect().
            then((data) => {
                this.messageSender.broadcastMessage(this.welcomeMessage);
                this.channels.forEach((channel) => channel.startCurrencyInterval());
            }).
            catch((err) => {

            });
    }

    disconnect() {
        this.client.disconnect();
    }
} 