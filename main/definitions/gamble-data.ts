export class GambleData {
    win: boolean;
    gambleValue: number;
    gambleResult: number;

    constructor(didWin: boolean, gambleValue: number, gambleResult: number) {
        this.win = didWin;
        this.gambleValue = gambleValue;
        this.gambleResult = gambleResult;
    }
}