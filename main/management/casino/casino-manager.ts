import { UserManager } from '../users/user-manager';
import { User } from '../users/user';
import { Observable } from 'rxjs';
import { SettingsManager } from '../../bot-settings/index';
import { CurrencyData, CurrencySettingsData, GambleData } from '../../definitions/index';
import { SlotMachineManager } from '../casino/slot-machine/index';
import * as moment from 'moment';

export class CasinoManager {
    private userManager: UserManager;
    private settingsManager: SettingsManager;
    private slotMachineManager: SlotMachineManager;
    private currencyIntervals: NodeJS.Timer[];

    constructor(userManager: UserManager, settingsManager: SettingsManager) {
        this.userManager = userManager;
        this.settingsManager = settingsManager;
        this.currencyIntervals = [];
        this.slotMachineManager = new SlotMachineManager();
    }
    /**Gives every user currently in the chat currency*/
    giveAllCurrency(channel: string, users: any, amount: number, currencyType: string, displayMessage: boolean) {
        let promise = this.userManager.getCurrentViewers(channel);
        promise.then((viewersObj) => {
            for (let viewerType in viewersObj) {
                for (let viewer of viewersObj[viewerType]) {
                    let user = this.changeUserCurrency(viewer, channel, amount, users, currencyType);
                    users[viewer] = user;
                }
            }

            this.userManager.updateUsersFile(users, channel);
        })
    }

    gambleCurrency(channelName: string, userName: string, users: any, amount: number, currencyType: string): string {
        // Remove the amount the user is gambling and put it
        let gambler = this.changeUserCurrency(userName, channelName, -amount, users, currencyType);
        let gambleResult = this.slotMachineManager.gamble(amount);

        gambler = this.changeUserCurrency(userName, channelName, gambleResult.gambleValue, users, currencyType);
        gambler.data.gambling["last-gamble-time"] = moment();

        users[userName] = gambler;

        this.userManager.updateUsersFile(users, channelName);

        return this.getGambleMessage(amount, gambleResult, gambler, currencyType);
    }

    getGambleMessage(gambleAmout: number, result: GambleData, gambler: User, currencyType: string): string {
        let message = gambler.data["display-name"] + " gambled " + gambleAmout + " " + currencyType + " and got a result of " + result.gambleResult + ".";
        if (result.win) {
            message += "\n You won " + result.gambleValue + " " + currencyType + " and now have " + gambler.data.currencies[currencyType].amount;
        }
        else {
            message += "\n You lost 😔" + currencyType + " count: " + gambler.data.currencies[currencyType].amount;
        }
        return message;
    }

    getUserCurrency(userName: string, channelName: string, users: any, currencyType: string): number {
        let user = this.userManager.getUser(userName, users);

        if (!(currencyType in user.data.currencies)) {
            user.data.currencies[currencyType] = new CurrencyData(currencyType, 0, channelName);
            users[userName] = user;
            this.userManager.updateUsersFile(users, channelName);
        }

        return user.data.currencies[currencyType].amount;
    }

    /**Gives a user a certain amount of alkcoins and returns it (negative amount reduces)*/
    changeUserCurrency(userName: string, channelName: string, amount: number, users: any, currencyType: string): User {
        let user: User;
        user = this.userManager.getUser(userName, users);

        if (!(currencyType in user.data.currencies)) {
            user.data.currencies[currencyType] = new CurrencyData(currencyType, 0, channelName);
        }

        user.data.currencies[currencyType].amount += amount;
        return user;
    }

    /**Starts the currency interval in the specified channels*/
    startCurrencyInterval(channels: string[]) {
        let settings = this.settingsManager.readBotSettingsSync();
        let currencySettings: CurrencySettingsData[] = [];

        // Unwarpped the # from the channel names
        channels = channels.map((channel) => channel.substr(1));

        channels.forEach((channel) => this.settingsManager.getChannelCurrencies(channel, settings)
            .forEach((channelSettings) => {
                currencySettings.push(channelSettings);
            }));

        for (let currencyObj of currencySettings) {
            let id = setInterval(() => {
                for (let channel of this.getConnectedCurrencyChannels(currencyObj, channels)) {
                    let users = this.userManager.getLatestUsers(channel);
                    this.giveAllCurrency(channel, users, currencyObj["amount-per-interval"], currencyObj.name, false);
                }
            }, currencyObj.interval)

            this.currencyIntervals.push(id);
        }
    }

    /**Returns only the channels which are configured to have the passed currency in their channel*/
    private getConnectedCurrencyChannels(settings: CurrencySettingsData, channels: string[]): string[] {
        return channels.filter((channel) => {
            if (settings.channels.indexOf(channel) !== -1) {
                return channel;
            }
        });
    }
}