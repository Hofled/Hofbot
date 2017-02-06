import { BotConnection } from './connection/index';
import { TmiOptions } from './definitions/connection-options'

// Authentication key required according to the account which you use for the bot
let options = new TmiOptions(true, true, 'alkcoins', 'oauth:9u1qyef5r4pttgrtyjhtgr32d1scq6', ["hofled"]);

let botConnection = new BotConnection(options);

botConnection.connect();