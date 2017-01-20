import { BotConnection } from './connection/index';
import { TmiOptions } from './definitions/connection-options'

// Authentication
let options = new TmiOptions(true, true, 'Hofbot', '', ["hofled"]);

let botConnection = new BotConnection(options);

botConnection.connect();