import { MessageData } from '../../definitions/index';
import { UserManager } from '../../management/users/user-manager';
import { CasinoManager } from '../../management/casino/index';

export class GiveawayManager {
    private userManager: UserManager;
    private casinoManager: CasinoManager;

    private isGiveawayLive: boolean;
    private minTicketEntry: number;
    private currentEntries: number;
    private giveawayList: { userName: string, entries: number }[];

    constructor(userManager: UserManager, casinoManager: CasinoManager) {
        this.userManager = userManager;
        this.casinoManager = casinoManager;
        this.isGiveawayLive = false;
        this.currentEntries = 0;
        this.minTicketEntry = 0;
        this.giveawayList = [];
    }

    startGiveaway(msgData: MessageData, params?: any[]): string {
        if (this.isGiveawayLive) {
            return "There is already an active giveaway.";
        }

        let minTicketCount = parseInt(params[0]);
        if (!this.isValidNumber(minTicketCount)) {
            return "Invalid minimum ticket amount";
        }

        this.minTicketEntry = minTicketCount;
        this.isGiveawayLive = true;
        return "Giveaway is now active with a minimum entry value of " + this.minTicketEntry + "!" +
            " \nType !entergiveaway [ticket number] to join the giveaway!";
    }

    /** Registers a user to the giveaway with a set amount of currency */
    registerUser(userName: string, channelName: string, currencyType: string, params?: any[]): string {
        if (!this.isGiveawayLive) {
            return "There is no active giveaway.";
        }

        let tickets = parseInt(params[0]);
        if (!this.isValidNumber(tickets)) {
            return "Invalid ticket amount.";
        }

        if (tickets < this.minTicketEntry) {
            return userName + " you must buy at least " + this.minTicketEntry + " tickets.";
        }

        let currencyCount = this.casinoManager.getUserCurrency(userName, channelName, currencyType);
        if (tickets > currencyCount) {
            return userName + " you do not have enough currency to buy this many tickets.";
        }

        let userIndex = this.giveawayList.findIndex(user => user.userName == userName);
        if (userIndex == -1) {
            this.giveawayList.push({ userName: userName, entries: tickets });
            this.userBuyTickets(userName, channelName, currencyType, -tickets);
            return null;
        }

        this.giveawayList[userIndex].entries += tickets;
        this.userBuyTickets(userName, channelName, currencyType, -tickets);
        return null;
    }

    endGiveaway(): string {
        if (!this.isGiveawayLive) {
            return "There is no active giveaway.";
        }

        this.isGiveawayLive = false;

        if (this.giveawayList.length == 0) {
            return "The giveaway has ended but with no winner since no one entered it!";
        }

        let winner = this.rollWinner();
        this.giveawayList = [];
        return "The winner of the giveaway is ... " + winner + " !";
    }

    /** Used to cancel the giveaway */
    cancelGiveaway(channelName: string, currencyType: string): string {
        if (!this.isGiveawayLive) {
            return "There is no active giveaway.";
        }

        this.isGiveawayLive = false;
        this.giveawayList.forEach(user => {
            this.casinoManager.changeUserCurrency(user.userName, channelName, user.entries, currencyType);
        })

        this.giveawayList = [];

        return "Giveaway has been canceled and all registerd users have been refunded.";
    }

    private userBuyTickets(userName: string, channelName: string, currencyType: string, amount: number) {
        this.casinoManager.changeUserCurrency(userName, channelName, amount, currencyType);
    }

    /** Checks if a value is parsable to int and greater then 0 */
    private isValidNumber(value: any): boolean {
        let parsedNumber = parseInt(value);
        return !(isNaN(parsedNumber) || parsedNumber <= 0);
    }

    private rollWinner(): string {
        let tickets: string[] = [];
        this.giveawayList.forEach(user => {
            for (let i = 0; i < user.entries; i++) {
                tickets.push(user.userName);
            }
        })

        // Rolls between an index of 0 to length - 1
        let winnerIndex = Math.floor(Math.random() * (tickets.length - 1));
        return tickets[winnerIndex];
    }
}