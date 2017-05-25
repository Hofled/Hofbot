import * as moment from 'moment';
import { CurrencyData } from '../definitions';

export class UserData {
    gambling: {
        time: moment.Moment;
    }

    currencies: CurrencyData[];

    permission: number;

    userName: string;

    constructor(name: string) {
        this.userName = name;
        this.currencies = [];
        this.permission = 1;
        this.gambling = { time: moment() };
    }
}