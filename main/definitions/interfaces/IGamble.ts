import { User } from '../';
import { GambleData } from '../index';

export interface IGamble {
    // Returns the result of the gamble (negative if lost)
    gamble(amount: number): GambleData;
}