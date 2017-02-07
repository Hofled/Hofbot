import { CommandData, MessageData } from '../../definitions/index';
import { IExecuter } from '../../definitions/interfaces/IExecuter';
import { CommandManager } from '../../management/commands/index';
import { MessageSender } from '../messages/index';
import { CooldownManager } from '../../management/cooldown/cooldown-manager';

export class LoggerExecuter implements IExecuter {
    private messageSender: MessageSender;
    private commandManager: CommandManager;
    cooldownManager: CooldownManager;

    constructor(messageSender: MessageSender, cooldownManager: CooldownManager, commandManager: CommandManager) {
        this.messageSender = messageSender;
        this.cooldownManager = cooldownManager;
        this.commandManager = commandManager;
    }

    execute(command: CommandData, msgData: MessageData, params?: any[]) {
        switch (command.name) {
            case 'commands': {
                let allCommands = this.commandManager.getLatestCommands();
                let message = 'The available commands are: ';
                for (let commandWrapper of allCommands) {
                    let formatedCommand = '!' + Object.keys(commandWrapper)[0] + ' ';
                    message += formatedCommand;
                }

                this.messageSender.sendMessage(msgData.channelName, message);

                this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
                break;
            }
        }
    }
}