import { Observable } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';

import { UserManager } from '../users/user-manager';
import { SettingsManager } from '../../bot-settings/index';
import { CurrencyData, CurrencySettingsData, GambleData, UserData } from '../../definitions/index';
import { SlotMachineManager } from '../casino/slot-machine/index';

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
        promise
            .then((viewersObj) => {
                let usersDB = this.userManager.getAllUsers();
                let usersArray = usersDB.users;

                for (let viewerType in viewersObj) {
                    for (let viewer of viewersObj[viewerType]) {

                        let index = _.findIndex(usersArray, wrapper => wrapper[viewer] != undefined);
                        index = index == -1 ? usersArray.length : index;
                        let userData = _.get(usersDB.users, [index, viewer, 'data'], new UserData(viewer));
                        userData = this.changeUserCurrencyLocal(userData, amount, currencyType);
                        _.set(usersArray, [index, viewer, 'data'], userData);
                    }
                }

                this.userManager.updateAllUsers(usersArray);
            })
            .catch(reason => {
                console.log("Failed at currency interval:\n");
                console.log(reason);
                console.log("\n");
            });
    }

    gambleCurrency(channelName: string, userName: string, amount: number, currencyType: string): string {
        // Remove the amount the user is gambling and put it
        this.changeUserCurrency(userName, channelName, -amount, currencyType);
        let gambleResult = this.slotMachineManager.gamble(amount);
        let gamblerData = this.changeUserCurrency(userName, channelName, gambleResult.gambleOutcome, currencyType);
        
        gamblerData.gambling["last-gamble-time"] = moment();

        this.userManager.updateUserData(userName, gamblerData);

        return this.getGambleMessage(amount, gambleResult, gamblerData, currencyType);
    }

    private updateGambleTime(gamblerName: string, time: moment.Moment) {
        this.userManager.updateUserData
    }

    private getGambleMessage(gambleAmout: number, result: GambleData, gamblerData: UserData, currencyType: string): string {
        let message = gamblerData["display-name"] + " gambled " + gambleAmout + " " + currencyType + " and got a result of " + result.gambleResult + ".";
        if (result.win) {
            message += "\n You won " + result.gambleOutcome + " " + currencyType + " and now have " + gamblerData.currencies[currencyType].amount;
        }
        else {
            message += "\n You lost 😔" + currencyType + " count: " + gamblerData.currencies[currencyType].amount;
        }
        return message;
    }

    getUserCurrency(userName: string, channelName: string, currencyType: string): number {
        let userData = this.userManager.getUserData(userName);
        if (!(currencyType in userData.currencies)) {
            userData.currencies[currencyType] = new CurrencyData(0);
            this.userManager.updateUserData(userName, userData);
            return userData.currencies[currencyType].amount;
        }

        return userData.currencies[currencyType].amount;
    }

    /** Acts the same as changeUserCurrency, but doesnt updates/access the DB */
    private changeUserCurrencyLocal(userData: UserData, amount: number, currencyType: string): UserData {
        if (!(currencyType in userData.currencies)) {
            userData.currencies[currencyType] = new CurrencyData(0);
        }

        userData.currencies[currencyType].amount += amount;

        return userData;
    }

    /** Gives a user a certain amount of currency (negative amount reduces) 
     * @returns {UserData} returns the updated UserData object
    */
    changeUserCurrency(userName: string, channelName: string, amount: number, currencyType: string): UserData {
        let userData = this.userManager.getUserData(userName);
        if (!(currencyType in userData.currencies)) {
            userData.currencies[currencyType] = new CurrencyData(0);
        }
        userData.currencies[currencyType].amount += amount;
        this.userManager.updateUserData(userName, userData);

        return userData;
    }

    /**Starts the currency interval in the specified channels*/
    startCurrencyInterval(channelName: string) {
        let channelCurrency = this.settingsManager.getChannelCurrency(channelName);

        let id = setInterval(() => {
            this.giveAllCurrency(channelName, channelCurrency["amount-per-interval"], channelCurrency.name,
                false);
        }, channelCurrency.interval)

        this.currencyIntervals.push(id);
    }
}