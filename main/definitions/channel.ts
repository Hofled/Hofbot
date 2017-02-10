import * as tmi from 'tmi.js';

import { MessageData, MessageType, TmiOptions } from './index';
import { MessageSender, MessageBuilder } from '../functionality/messages/index';
import { PermissionValidator } from '../functionality/permissions/index';
import { CommandHandler } from '../management/commands/index';
import { CasinoManager } from '../management/casino/index';
import { SettingsManager } from '../bot-settings/index';
import { UserManager } from '../management/users/user-manager';
import { CooldownManager } from '../management/cooldown/cooldown-manager';
import { GiveawayManager } from '../functionality/giveaway/index';

/** A logical representation of a single channel connection */
export class Channel {
    public name: string;
    private messageSender: MessageSender;
    private messageBuilder: MessageBuilder;
    private commandHandler: CommandHandler;
    private casinoManager: CasinoManager;
    private userManager: UserManager;

    constructor(name: string, client: tmi.client, tmiOptions: TmiOptions, settingsManager: SettingsManager, cooldownManager: CooldownManager) {
        this.name = name;
        this.messageSender = new MessageSender(client, tmiOptions);
        this.messageBuilder = new MessageBuilder();
        this.userManager = new UserManager(name);
        let permissionValidator = new PermissionValidator(this.userManager);
        this.casinoManager = new CasinoManager(this.userManager, settingsManager);
        let giveawayManager = new GiveawayManager(this.userManager, this.casinoManager);
        this.commandHandler = new CommandHandler(this.messageSender, this.messageBuilder, settingsManager, this.casinoManager, cooldownManager, permissionValidator, this.userManager, giveawayManager);
    }

    startCurrencyInterval() {
        this.casinoManager.startCurrencyInterval(this.name);
    }

    handleMessage(data: MessageData) {
        this.commandHandler.handleMessage(data);
    }
}