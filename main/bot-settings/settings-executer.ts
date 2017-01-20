import { SettingsManager } from './index';
import { IExecuter } from './../definitions/interfaces/IExecuter';
import { CommandData, MessageData } from '../definitions/index';
import { CooldownManager } from '../management/cooldown/cooldown-manager';
import { MessageSender } from '../functionality/messages/index';

export class SettingsExecuter implements IExecuter {
    private settingsManager: SettingsManager;
    private messageSender: MessageSender;
    cooldownManager: CooldownManager;

    constructor(settingsManager: SettingsManager, cooldownManager: CooldownManager, messageSender: MessageSender) {
        this.settingsManager = settingsManager;
        this.cooldownManager = cooldownManager;
        this.messageSender = messageSender;
    }

    execute(command: CommandData, msgData: MessageData, params?: any[]) {
        switch (command.name) {
            case 'setcooldown': {
                if (!this.settingsManager.updateCooldown('cooldown', params[0])) {
                    this.messageSender.sendMessage(msgData.channelName, "Invalid cooldown value.")
                    break;
                }

                this.messageSender.sendMessage(msgData.channelName, "cooldown has been set to " + params[0] + " seconds.")
                this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
                break;
            }
            case 'gamblecooldown': {
                if (!this.settingsManager.updateCooldown('gamble-cooldown', params[0])) {
                    this.messageSender.sendMessage(msgData.channelName, "Invalid cooldown value.")
                    break;
                }

                this.messageSender.sendMessage(msgData.channelName, "gambling cooldown has been set to " + params[0] + " seconds.")
                this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
                break;
            }
        }
    }
}