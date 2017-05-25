export class CurrencyData {
    amount: number;
    channel: string;
    currencyName: string;

    constructor(amount: number, channelName: string, name: string) {
        this.amount = amount;
        this.channel = channelName;
        this.currencyName = name;
    }
}