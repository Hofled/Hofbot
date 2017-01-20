import * as moment from 'moment';
import { CurrencyData } from '../definitions/index';

export class UserData {
    gambling: {
        "last-gamble-time": moment.Moment;
    }

    currencies: {
        [currency: string]: CurrencyData
    }

    permission: number;

    "display-name": string;

    constructor(name: string) {
        this["display-name"] = name;
        this.currencies = {};
        this.permission = 1;
        this.gambling = { "last-gamble-time": null };
    }
}