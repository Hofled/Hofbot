import { CommandData, MessageData } from '../../definitions/index';
import { MessageBuilder, MessageSender } from '../../functionality/messages/index';
import { CommandManager, CommandCRUDExecuter } from '../commands/index';
import { UserManager } from '../users/user-manager';
import { DataBaseManager } from '../../functionality/db/index';
import { CasinoExecuter, CasinoManager } from '../casino/index';
import { LoggerExecuter } from '../../functionality/logging/index';
import { SettingsExecuter, SettingsManager } from '../../bot-settings/index';
import { CooldownManager } from '../cooldown/cooldown-manager';

export class CommandTasker {
    private messageSender: MessageSender;
    private cooldownManager: CooldownManager;
    private casinoExecuter: CasinoExecuter;
    private commandCRUDExecuter: CommandCRUDExecuter;
    private loggerExecuter: LoggerExecuter;
    private settingsExecuter: SettingsExecuter;

    constructor(cooldownManager: CooldownManager, commandManager: CommandManager, messageSender: MessageSender, messageBuiler: MessageBuilder, casinoManager: CasinoManager, settingsManager: SettingsManager, userManager: UserManager) {
        this.cooldownManager = cooldownManager;
        this.messageSender = messageSender;
        let messageBuilder = new MessageBuilder();
        this.casinoExecuter = new CasinoExecuter(casinoManager, this.messageSender, messageBuiler, this.cooldownManager, userManager);
        this.commandCRUDExecuter = new CommandCRUDExecuter(commandManager, this.messageSender, this.cooldownManager);
        this.loggerExecuter = new LoggerExecuter(this.messageSender, this.cooldownManager, commandManager);
        this.settingsExecuter = new SettingsExecuter(settingsManager, this.cooldownManager, this.messageSender);
    }

    /**Tasks a specific command type to its corrosponding processor*/
    taskCommand(command: CommandData, msgData: MessageData, params?: any[]) {
        if (!command.internal) {
            this.messageSender.sendMessage(msgData.channelName, command.content);
            this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
            return;
        }

        if (command["command-crud"]) {
            this.commandCRUDExecuter.execute(command, msgData, params);
        }
        else if (command.casino) {
            this.casinoExecuter.execute(command, msgData, params);
        }
        else if (command.log) {
            this.loggerExecuter.execute(command, msgData, params);
        }
        else if (command["bot-settings"]) {
            this.settingsExecuter.execute(command, msgData, params);
        }
    }
}