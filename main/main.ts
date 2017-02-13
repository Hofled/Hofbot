import { BotConnection } from './connection/index';
import { TmiOptions } from './definitions/connection-options'

// Authentication key required according to the account which you use for the bot
let options = new TmiOptions(true, true, 'alkcoins', 'oauth:s0xzbi3e7jwuun7400q2gezks78zs6', ["hofled"]);

let botConnection = new BotConnection(options);

botConnection.connect();