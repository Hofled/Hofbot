import { CommandData } from '../../definitions/command-data';
import { InputValidator } from '../../functionality/input/input-validator';
import { DataBaseManager } from '../../functionality/db/index';

/**
 * This class is responsible for storing all the commands and managing them, performing operations such as deleting and adding new commands
 */
export class CommandManager {
    private inputValidator: InputValidator;
    private dbManager: DataBaseManager;
    private readonly commandsFile: string = 'main/management/commands/storage/commands.json';
    private readonly commandsDbKey: string = 'commands';

    constructor(inputValidator: InputValidator) {
        this.dbManager = new DataBaseManager(this.commandsFile);
        this.inputValidator = inputValidator;
    }

    /**Returns a CommandData object according to the passed command name.*/
    getCommandData(commandName: string): CommandData | boolean {
        if (!this.checkCommandExists(commandName, { parentKey: this.commandsDbKey, predicate: { name: commandName } })) {
            return false;
        }
        let command = this.dbManager.findValue<CommandData>(this.commandsDbKey, { name: commandName });
        return command;
    }

    addCommand(commandName: string, content: string): string {
        if (this.checkCommandExists(commandName, { parentKey: this.commandsDbKey, predicate: { name: commandName } })) {
            return commandName + " already exists.";
        }

        if (!this.inputValidator.isValidCommandName(commandName)) {
            return "A command name can only consist of characters and numbers.";
        }

        if (!this.inputValidator.isValidCommandContent(content.split(' '))) {
            return "༼ง=ಠ益ಠ=༽ง You trying to play with me? This command is invalid!";
        }

        this.dbManager.pushValue(this.commandsDbKey, { name: commandName, data: new CommandData(1, commandName, content) });

        return commandName + " has been added successfully.";
    }

    delCommand(commandName: string): string {
        if (!this.checkCommandExists(commandName, { parentKey: this.commandsDbKey, predicate: { name: commandName } })) {
            return commandName + " command does not exist.";
        };

        let command = this.dbManager.findValue<CommandData>(this.commandsDbKey, { name: commandName });

        if (command.native) {
            return commandName + " command can not be deleted.";
        };

        this.dbManager.removeValue('commands', { name: commandName });

        return "the " + commandName + " command has been deleted successfully.";
    }

    updateCommand(commandName: string, newContent: string): string {
        if (!this.checkCommandExists(commandName, { parentKey: this.commandsDbKey, predicate: { name: commandName } })) {
            return commandName + " does not exist so it can not be updated.";
        };

        let commandData = this.dbManager.findValue<CommandData>('commands', { name: commandName });

        if (commandData.native) {
            return commandName + " can not be edited.";
        }

        commandData.content = newContent;

        this.dbManager.assignValue('commands', { name: commandName }, { data: commandData })

        return commandName + " has been updated successfully.";
    }

    /**Checks if a command exists.*/
    private checkCommandExists(commandName: string, arrayQueuery: { parentKey: string, predicate: any }): boolean {
        return this.dbManager.checkHas(commandName, arrayQueuery);
    }

    getLatestCommands(): any {
        return this.dbManager.getEntireDB();
    }
}