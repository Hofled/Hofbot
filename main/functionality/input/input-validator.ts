export class InputValidator {
    /**
     * Checks if the command is valid.
     * A valid command is a command starting with the '!' character and is not made of only whitespaces.
     */
    isValidCommand(message: string) {
        return message.startsWith("!") && this.checkWhitespaces(message);
    }

    private checkWhitespaces(input: string): boolean {
        return /\S/.test(input.slice(1, input.length)) && input.charAt(1) !== ' ';
    }

    isValidCommandName(commandName: string): boolean {
        return /^[a-zA-Z0-9]+$/.test(commandName);
    }

    isValidCommandContent(content: string[]): boolean {
        return !(content[0].startsWith("/") || content[0].startsWith(".")) || content[0].startsWith('!');
    }
}