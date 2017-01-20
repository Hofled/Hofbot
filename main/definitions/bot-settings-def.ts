import { CurrencySettingsData } from '../definitions/index';

export class BotSettings {
    cooldown: number;
    "gamble-cooldown": number;
    currencies: {
        [currency: string]: CurrencySettingsData
    }

    constructor(cooldown: number, currencies: { [currency: string]: CurrencySettingsData }, gambleCooldown: number) {
        this.cooldown = cooldown;
        this.currencies = currencies;
        this["gamble-cooldown"] = gambleCooldown;
    }
}