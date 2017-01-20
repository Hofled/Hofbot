import { IGamble } from '../../../definitions/interfaces/IGamble';
import { User } from '../../users/user';
import { GambleData } from '../../../definitions/index';

export class SlotMachineManager implements IGamble {
    /**The threshold for winning gambles in percentages*/
    private winThreshold: number;

    constructor(winThreshold: number = 60) {
        this.winThreshold = winThreshold;
    }

    gamble(amount: number): GambleData {
        let gambleValue = amount;
        let gambleResult = this.roll();
        let didWin = gambleResult > this.winThreshold;

        didWin ? gambleValue = gambleValue * 2 : gambleValue = 0;
        return new GambleData(didWin, gambleValue, gambleResult);
    }

    roll(): number {
        return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    }
}