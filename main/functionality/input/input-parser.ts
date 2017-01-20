import { MessageData } from "../../definitions/message-data"

export class InputParser {
    /**
     * Gets the command name from the passed input.
     * A command is deterimined by what ever word that comes after the ! command indicator until the next white space.
     */
    getCommandName(rawInput: string): string {
        let input = this.unwrapCommandPrefix(rawInput);
        return input.split(' ')[0];
    }

    /**
     * Gets the command parameter following the command name.
     */
    getCommandParams(rawInput: string): string[] {
        let input = this.unwrapCommandPrefix(rawInput);
        let splitStr = input.split(' ');
        return splitStr.slice(1, splitStr.length);
    }

    /**Removes the command prefix from the input*/
    private unwrapCommandPrefix(rawInput: string): string {
        return rawInput.slice(1, rawInput.length);
    }
}