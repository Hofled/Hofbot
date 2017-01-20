import * as tmi from 'tmi.js';
import { MessageSender, MessageBuilder } from '../functionality/messages/index';
import { MessageData, MessageType, TmiOptions } from '../definitions/index';
import { CommandHandler } from '../management/commands/index';
import { FileHandler } from '../functionality/files/index';
import { CasinoManager } from '../management/casino/index';
import { SettingsManager } from '../bot-settings/index';
import { UserManager } from '../management/users/user-manager';
import { CooldownManager } from '../management/cooldown/cooldown-manager';
import { PermissionValidator } from '../functionality/permissions/index';
import { BackupManager } from '../functionality/backup/index';

export class BotConnection {
    private client: tmi.client;
    private tmiOptions: TmiOptions;
    private messageSender: MessageSender;
    private commandHandler: CommandHandler;
    private casinoManager: CasinoManager;
    private userManager: UserManager;
    private backupManager: BackupManager;

    private welcomeMessage: string = "Hello! KAPOW I am %n MrDestructoid";

    constructor(options) {
        this.tmiOptions = options;
        this.client = new tmi.client(this.tmiOptions);
        let fileHandler = new FileHandler();
        this.messageSender = new MessageSender(this.client, this.tmiOptions);
        let messageBuilder = new MessageBuilder();
        this.userManager = new UserManager(fileHandler);
        let permissionValidator = new PermissionValidator(this.userManager);
        let settingsManager = new SettingsManager(fileHandler);
        this.casinoManager = new CasinoManager(this.userManager, settingsManager);
        let cooldownManager = new CooldownManager(settingsManager, this.tmiOptions.channels);
        this.commandHandler = new CommandHandler(this.messageSender, messageBuilder, fileHandler, settingsManager, this.casinoManager, cooldownManager, permissionValidator);
        this.backupManager = new BackupManager();

        this.welcomeMessage = messageBuilder.formatMessage(this.welcomeMessage, [this.tmiOptions.identity.username]);

        this.backupManager.startBackupInterval(1800, "main/management/users/storage", "json");

        // Starting to listen on messages received in the chats the client is connected to.
        this.listenToConnection(this.commandHandler);
    }

    private listenToConnection(commandHandler: CommandHandler) {
        this.client.on("message", function (channel, userstate, message, self) {

            let messageData = new MessageData(channel, userstate, message, self);

            if (messageData.self) return;

            switch (messageData.userState.messageType) {
                case MessageType.action:
                    commandHandler.handleMessage(messageData);
                    break;
                case MessageType.chat:
                    commandHandler.handleMessage(messageData);
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
                this.tmiOptions.channels.forEach((channel) => {
                    this.userManager.genNewChannelUsers(channel.substr(1));
                });
                this.messageSender.broadcastMessage(this.welcomeMessage);
                this.casinoManager.startCurrencyInterval(this.tmiOptions.channels);
            }).
            catch((err) => {

            });
    }

    disconnect() {
        this.client.disconnect();
    }
} 