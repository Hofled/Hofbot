import { IExecuter } from '../../definitions/interfaces/IExecuter';
import { CasinoManager } from '../casino/casino-manager';
import { CommandData, MessageData } from '../../definitions/index';
import { MessageBuilder, MessageSender } from '../../functionality/messages/index';
import { UserManager } from '../users/user-manager';
import { CooldownManager } from '../cooldown/cooldown-manager';

export class CasinoExecuter implements IExecuter {
    private casinoManager: CasinoManager;
    private messageSender: MessageSender;
    private messageBuilder: MessageBuilder;
    private userManager: UserManager;
    cooldownManager: CooldownManager;

    constructor(casinoManager: CasinoManager, messageSender: MessageSender, messageBuilder: MessageBuilder, cooldownManager: CooldownManager, userManager: UserManager) {
        this.casinoManager = casinoManager;
        this.messageSender = messageSender;
        this.messageBuilder = messageBuilder;
        this.cooldownManager = cooldownManager;
        this.userManager = userManager;
    }

    execute(command: CommandData, msgData: MessageData, params?: any[]) {
        switch (command.name) {
            case 'hofcoins': {
                let coins = this.casinoManager.getUserCurrency(msgData.userState.username, msgData.channelName, "hofcoins");
                let msg = this.messageBuilder.formatMessage("%n has %n hofcoins.", [msgData.userState.username, coins]);
                this.messageSender.sendMessage(msgData.channelName, msg);
                this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
                break;
            }
            case 'gamble': {
                // Currently only supports gambling of hofcoins
                let currencyType = "hofcoins";
                let gamblerData = this.userManager.getUserData(msgData.userState.username);

                if (!this.cooldownManager.canGamble(msgData.messageTime, gamblerData.gambling["last-gamble-time"])) {
                    let msg = this.messageBuilder.formatMessage("%n you can only gamble every %n seconds.", [msgData.userState.username, this.cooldownManager.getGambleCooldown()]);
                    this.messageSender.sendMessage(msgData.channelName, msg);
                    this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
                    break;
                }

                let gambleAmount = parseInt(params[0]);
                if (isNaN(gambleAmount) || gambleAmount <= 0) {
                    let message = "Invalid gamble amount.";
                    this.messageSender.sendMessage(msgData.channelName, message);
                    break;
                }

                if (this.casinoManager.getUserCurrency(msgData.userState.username, msgData.channelName, currencyType) < gambleAmount) {
                    let message = gamblerData["display-name"] + " - You do not have a sufficient currency count to gamble that much.";
                    this.messageSender.sendMessage(msgData.channelName, message);
                    break;
                }

                let gambleResult = this.casinoManager.gambleCurrency(msgData.channelName, msgData.userState.username, gambleAmount, currencyType);
                this.messageSender.sendMessage(msgData.channelName, gambleResult);
                this.cooldownManager.resetLastCommandTime(msgData.messageTime, msgData.channelName);
                break;
            }
        }
    }
}