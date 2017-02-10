import { IExecuter } from '../../definitions/interfaces/IExecuter';
import { CooldownManager } from '../../management/cooldown/cooldown-manager';
import { SettingsManager } from '../../bot-settings/index';
import { GiveawayManager } from './index';
import { MessageData, CommandData } from '../../definitions/index';
import { MessageSender } from '../messages/index';

/**
 * GiveawayExecuter
 */
export class GiveawayExecuter implements IExecuter {
    cooldownManager: CooldownManager;
    private giveawayManager: GiveawayManager;
    private messageSender: MessageSender;
    private settingsManager: SettingsManager;

    constructor(giveawayManager: GiveawayManager, messageSender: MessageSender, settingsManager: SettingsManager) {
        this.giveawayManager = giveawayManager;
        this.messageSender = messageSender;
        this.settingsManager = settingsManager;
    }

    execute(command: CommandData, msgData: MessageData, params?: any[]) {
        switch (command.name) {
            case "giveaway": {
                let msg = this.giveawayManager.startGiveaway(msgData, params);
                this.messageSender.sendMessage(msgData.channelName, msg);
                break;
            }

            case "entergiveaway": {
                let channelCurrrency = this.settingsManager.getChannelCurrency(msgData.channelName).name;
                let msg = this.giveawayManager.registerUser(msgData.userState.username, msgData.channelName, channelCurrrency, params);
                if (!(msg == null)) {
                    this.messageSender.sendMessage(msgData.channelName, msg);
                }
                break;
            }

            case "cancelgiveaway": {
                let channelCurrrency = this.settingsManager.getChannelCurrency(msgData.channelName).name;
                let msg = this.giveawayManager.cancelGiveaway(msgData.channelName, channelCurrrency);
                this.messageSender.sendMessage(msgData.channelName, msg);
                break;
            }

            case "endgiveaway": {
                let msg = this.giveawayManager.endGiveaway();
                this.messageSender.sendMessage(msgData.channelName, msg);
                break;
            }
        }
    }
}