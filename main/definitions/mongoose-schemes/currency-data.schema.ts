import { Schema } from "mongoose";

export class CurrencyDataSchema extends Schema {
    amount: number;
    channel: string;
}