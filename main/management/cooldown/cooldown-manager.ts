import * as moment from 'moment';
import { SettingsManager } from '../../bot-settings/index';
import { BotSettings } from '../../definitions/bot-settings-def';

export class CooldownManager {
    private settingsManager: SettingsManager;
    private botSettings: BotSettings;
    private channelsLastCommand: { [channel: string]: moment.Moment };

    constructor(settingsManager: SettingsManager, channels: string[]) {
        this.settingsManager = settingsManager;
        this.botSettings = this.settingsManager.getBotSettings();
        this.channelsLastCommand = {};
        this.initLastCommandTimes(channels);
        this.registerSettingsChange();
    }

    registerSettingsChange() {
        this.settingsManager.settingsEmitter.on('settings-changed', (newSettings: BotSettings) => {
            this.botSettings = newSettings;
        });
    }

    initLastCommandTimes(channels: string[]) {
        let channelNames = channels.map((channel) => channel.substr(1));
        channelNames.forEach((channelName) => this.channelsLastCommand[channelName] = moment());
    }

    canProcessCommand(commandTime: moment.Moment, channelName: string): boolean {
        return commandTime.diff(this.channelsLastCommand[channelName]) > this.botSettings.cooldown;
    }

    /**Resets the last command time when a command is being executed.*/
    resetLastCommandTime(executedTime: moment.Moment, channelName: string) {
        this.channelsLastCommand[channelName] = executedTime;
    }

    canGamble(gambleTime: moment.Moment, lastGambleTime: moment.Moment): boolean {
        // If a user does not have a registered last gamble time, let him gamble:
        if (lastGambleTime == null){
            return true;
        }
        return gambleTime.diff(lastGambleTime) > this.botSettings["gamble-cooldown"];
    }

    /**Returns the current gamble cooldown in seconds. */
    getGambleCooldown(): number {
        return this.botSettings["gamble-cooldown"] / 1000;
    }
}