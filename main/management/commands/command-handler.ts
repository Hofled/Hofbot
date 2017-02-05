import { CommandData, MessageData } from '../../definitions/index';
import { MessageSender, MessageBuilder } from '../../functionality/messages/index';
import { InputParser, InputValidator } from '../../functionality/input/index';
import { CommandManager, CommandTasker } from '../../management/commands/index';
import { SettingsManager } from '../../bot-settings/index';
import { DataBaseManager } from '../../functionality/db/index';
import { CasinoManager } from '../casino/casino-manager';
import { CooldownManager } from '../cooldown/cooldown-manager';
import { PermissionValidator } from '../../functionality/permissions/index';
import { UserManager } from '../users/user-manager';

export class CommandHandler {
    private inputParser: InputParser;
    private inputValidator: InputValidator;
    private permissionsValidator: PermissionValidator;
    private commandManager: CommandManager;
    private cooldownManager: CooldownManager;
    private commandTasker: CommandTasker;
    private messageSender: MessageSender;

    constructor(messageSender: MessageSender, messageBuilder: MessageBuilder, settingsManager: SettingsManager, casinoManager: CasinoManager, cooldownManager: CooldownManager, permissionValidator: PermissionValidator, userManager: UserManager) {
        this.permissionsValidator = permissionValidator;
        this.messageSender = messageSender;
        this.inputParser = new InputParser();
        this.inputValidator = new InputValidator();
        this.commandManager = new CommandManager(this.inputValidator);
        this.cooldownManager = cooldownManager;
        this.commandTasker = new CommandTasker(this.cooldownManager, this.commandManager, this.messageSender, messageBuilder, casinoManager, settingsManager, userManager);
    }

    handleMessage(data: MessageData) {
        // Checks if the input is a valid command
        if (!this.inputValidator.isValidCommand(data.message)) return;

        let commandName = this.inputParser.getCommandName(data.message);
        let commandsObj = this.commandManager.getLatestCommands();
        let command = this.commandManager.getCommandData(commandName);

        if (command == false) return;
        command = command as CommandData;

        if (!this.permissionsValidator.checkPermission(data.userState.username, command.permission)) {
            this.messageSender.sendMessage(data.channelName, "Insufficient permissions.");
            this.cooldownManager.resetLastCommandTime(data.messageTime, data.channelName);
            return;
        }

        // Filter messages based on the cooldown.
        if (command.cooldown && !(this.cooldownManager.canProcessCommand(data.messageTime, data.channelName))) return;

        let params = this.inputParser.getCommandParams(data.message);

        this.commandTasker.taskCommand(command, data, params);
    }
}