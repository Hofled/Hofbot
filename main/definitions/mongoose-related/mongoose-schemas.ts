import { Schema } from "mongoose";

var currencyDataSchema = new Schema({
    amount: Number,
    channel: String,
    currencyName: String
});

export var userDataSchema = new Schema({
    gambling: Schema.Types.Date,
    currencies: [currencyDataSchema],
    permission: Schema.Types.Number,
    userName: Schema.Types.String
});