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
    giveAllCurrency(channelName: string, amount: number, currencyType: string, displayMessage: boolean) {
        let promise = this.userManager.getCurrentViewers(channelName);
        promise.then((viewersObj) => {
            for (let viewerType in viewersObj) {
                for (let viewer of viewersObj[viewerType]) {
                    this.changeUserCurrency(viewer, channelName, amount, currencyType);
                }
            }
        })
    }

    gambleCurrency(channelName: string, userName: string, amount: number, currencyType: string): string {
        // Remove the amount the user is gambling and put it
        this.changeUserCurrency(userName, channelName, -amount, currencyType);
        let gambleResult = this.slotMachineManager.gamble(amount);
        this.changeUserCurrency(userName, channelName, gambleResult.gambleOutcome, currencyType);

        let gambler = this.userManager.getUser(userName);
        gambler.data.gambling["last-gamble-time"] = moment();

        this.userManager.updateUserData(userName, gambler.data);

        return this.getGambleMessage(amount, gambleResult, gambler, currencyType);
    }

    private updateGambleTime(gamblerName: string, time: moment.Moment) {
        this.userManager.updateUserData
    }

    getGambleMessage(gambleAmout: number, result: GambleData, gambler: User, currencyType: string): string {
        let message = gambler.data["display-name"] + " gambled " + gambleAmout + " " + currencyType + " and got a result of " + result.gambleResult + ".";
        if (result.win) {
            message += "\n You won " + result.gambleOutcome + " " + currencyType + " and now have " + gambler.data.currencies[currencyType].amount;
        }
        else {
            message += "\n You lost 😔" + currencyType + " count: " + gambler.data.currencies[currencyType].amount;
        }
        return message;
    }

    getUserCurrency(userName: string, channelName: string, currencyType: string): number {
        let user = this.userManager.getUser(userName);
        if (!(currencyType in user.data.currencies)) {
            user.data.currencies[currencyType] = new CurrencyData(0, channelName);
            this.userManager.updateUserData(userName, user.data);
        }

        return this.userManager.getUser(userName).data.currencies[currencyType].amount;
    }

    /**Gives a user a certain amount of currency (negative amount reduces)*/
    changeUserCurrency(userName: string, channelName: string, amount: number, currencyType: string) {
        let user = this.userManager.getUser(userName);
        if (!(currencyType in user.data.currencies)) {
            user.data.currencies[currencyType] = new CurrencyData(0, channelName);
        }
        user.data.currencies[currencyType].amount += amount;
        this.userManager.updateUserData(userName, user.data);
    }

    /**Starts the currency interval in the specified channels*/
    startCurrencyInterval(channelName: string) {
        let settings = this.settingsManager.getBotSettings();

        let channelCurrency = this.settingsManager.getChannelCurrency(channelName, settings);

        let id = setInterval(() => {
            this.giveAllCurrency(channelName, channelCurrency["amount-per-interval"], channelCurrency.name, false);
        }, channelCurrency.interval)

        this.currencyIntervals.push(id);
    }
}