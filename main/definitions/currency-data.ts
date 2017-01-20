export class CurrencyData{
    name: string;
    amount: number;
    channel: string;

    constructor(name: string, amount: number, channelName: string) {
        this.name = name;
        this.amount = amount;
        this.channel = channelName;
    }
}