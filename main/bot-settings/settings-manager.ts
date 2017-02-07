import { EventEmitter } from 'events';
import * as lowdb from 'lowdb';

import { BotSettings } from '../definitions/bot-settings-def';
import { DataBaseManager } from '../functionality/db/index';
import { CurrencySettingsData } from '../definitions/index';

/**A settings manager for the bot's global settings*/
export class SettingsManager {
    readonly settingsFile: string = "main/bot-settings/bot-settings.json";
    settingsEmitter: EventEmitter;
    private dbManager: DataBaseManager;

    constructor() {
        this.dbManager = new DataBaseManager(this.settingsFile);
        this.settingsEmitter = new EventEmitter();
    }

    getChannelCurrency(channel: string, settings: BotSettings): CurrencySettingsData {
        let currencySetting;
        for (let currency in settings.currencies) {
            if (settings.currencies[currency].channels.indexOf(channel) !== -1) {
                return currencySetting = settings.currencies[currency];
            }
        }
    }

    getBotSettings(): BotSettings {
        return this.dbManager.getEntireDB();
    }

    notifySettingsChanged() {
        this.settingsEmitter.emit('settings-changed', this.dbManager.getEntireDB());
    }

    /** Updates the cooldown field in the settings
     * @returns {boolean} returns whether cooldown was set successfully.
     * @param {string} newCooldown the cooldown specified in seconds.
     */
    updateCooldown(cooldownType: string, newCooldown: string): boolean {
        let cooldown = parseInt(newCooldown);
        if (isNaN(cooldown)) {
            return false;
        }

        this.dbManager.setValue(cooldownType, cooldown * 1000);
        this.notifySettingsChanged();
        return true;
    }
}