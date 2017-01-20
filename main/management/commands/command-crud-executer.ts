import { IExecuter } from '../../definitions/interfaces/IExecuter';
import { CommandData, MessageData } from '../../definitions/index';
import { CommandManager } from '../commands/index';
import { MessageSender } from '../../functionality/messages/message-sender';
import { CooldownManager } from '../cooldown/cooldown-manager';

export class CommandCRUDExecuter implements IExecuter {
    private commandManager: CommandManager;
    private messageSender: MessageSender;
    cooldownManager: CooldownManager;

    constructor(commandManager: CommandManager, messageSender: MessageSender, cooldownManager: CooldownManager) {
        this.commandManager = commandManager;
        this.messageSender = messageSender;
        this.cooldownManager = cooldownManager;
    }

    execute(command: CommandData, msgData: MessageData, params?: any[]) {
        switch (command.name) {
            case 'add': {
                let commnads = this.commandManager.getLatestCommands();
                let result = this.commandManager.addCommand(params[0], params.slice(1, params.length).join(' '), commnads);
                this.messageSender.sendMessage(msgData.channelName, result);
                this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
                break;
            }
            case 'remove': {
                let commnads = this.commandManager.getLatestCommands();
                let result = this.commandManager.delCommand(params[0], commnads);
                this.messageSender.sendMessage(msgData.channelName, result);
                this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
                break;
            }
            case 'update': {
                let commnads = this.commandManager.getLatestCommands();
                let result = this.commandManager.updateCommand(params[0], params.slice(1, params.length).join(' '), commnads);
                this.messageSender.sendMessage(msgData.channelName, result);
                this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
                break;
            }
        }

    }
}