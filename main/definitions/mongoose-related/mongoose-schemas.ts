import { Schema } from "mongoose";

export var commandDataSchema = new Schema({
    name: String,
    permission: Number,
    content: String,
    internal: Boolean,
    native: Boolean,
    bot_settings: Boolean,
    casino: Boolean,
    command_crud: Boolean,
    log: Boolean,
    cooldown: Boolean
});

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