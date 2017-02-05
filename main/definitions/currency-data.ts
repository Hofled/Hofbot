export class CurrencyData {
    amount: number;
    channel: string;

    constructor(amount: number, channelName: string) {
        this.amount = amount;
        this.channel = channelName;
    }
}