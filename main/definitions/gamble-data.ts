export class GambleData {
    win: boolean;
    gambleOutcome: number;
    gambleResult: number;

    constructor(didWin: boolean, gambleOutcome: number, gambleResult: number) {
        this.win = didWin;
        this.gambleOutcome = gambleOutcome;
        this.gambleResult = gambleResult;
    }
}