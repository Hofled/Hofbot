import { BotSettings } from '../definitions/bot-settings-def';
import { FileHandler } from '../functionality/files/index';
import { EventEmitter } from 'events';
import { CurrencySettingsData } from '../definitions/index';

/**A settings manager for the bot's global settings*/
export class SettingsManager {
    readonly settingsFile: string = "main/bot-settings/bot-settings.json";
    settingsChanged: EventEmitter;
    private fileHandler: FileHandler;

    constructor(fileHandler: FileHandler) {
        this.fileHandler = fileHandler;
        this.settingsChanged = new EventEmitter();
    }

    getChannelCurrencies(channel: string, settings: BotSettings): CurrencySettingsData[] {
        let currencySettings = [];
        for (let currency in settings.currencies) {
            if (settings.currencies[currency].channels.indexOf(channel) !== -1) {
                currencySettings.push(settings.currencies[currency]);
            }
        }

        return currencySettings;
    }

    readBotSettingsSync(): BotSettings {
        return this.fileHandler.readFileSync(this.settingsFile);
    }

    updateSettings(newSettings: BotSettings) {
        this.fileHandler.writeObjToFileSync(newSettings, this.settingsFile);
        this.settingsChanged.emit('settings-changed', newSettings);
    }

    /** Updates the specified cooldown field in the settings
     * 
     * @returns {boolean} 
     */
    updateCooldown(cooldownType: string, newCooldown: string): boolean {
        let cooldown = parseInt(newCooldown);
        if (isNaN(cooldown)) {
            return false;
        }
        let newSettings = this.readBotSettingsSync();
        // Command receives seconds from user and translates it into milliseconds.
        newSettings[cooldownType] = cooldown * 1000;
        this.updateSettings(newSettings);
        return true;
    }
}