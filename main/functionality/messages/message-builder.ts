export class MessageBuilder {

    /**Formats a string using the parameters passed and the %n location specifier*/
    formatMessage(message: string, params?: any[]): string {
        if (params == undefined) return message;

        // If the message has no params that needs to be inserted into it, return the message as is.
        if (params.length == 0) {
            return message;
        };

        let newMessage = message.replace(/(%+n)/, params[0]);
        params.splice(0, 1);
        return this.formatMessage(newMessage, params);
    }
}