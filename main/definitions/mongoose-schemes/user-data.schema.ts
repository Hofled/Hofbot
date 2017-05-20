import { Schema } from "mongoose";
import { CurrencyDataSchema } from "./";

export class UserDataSchema extends Schema {
    gambling: Schema.Types.Date;
    currencies: [CurrencyDataSchema];
    permission: Schema.Types.Number;
}