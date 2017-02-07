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
        if (!this.checkCommandExists(commandName)) {
            return false;
        }
        let commands = this.dbManager.getValue(this.commandsDbKey) as any[];
        let commandIndex = commands.findIndex(command => command[commandName] !== undefined);
        let searchQuery = [this.commandsDbKey, commandIndex, commandName];
        let commandData = this.dbManager.querySearch<CommandData>(searchQuery);
        return commandData;
    }

    addCommand(commandName: string, content: string): string {
        if (this.checkCommandExists(commandName)) {
            return commandName + " already exists.";
        }

        if (!this.inputValidator.isValidCommandName(commandName)) {
            return "A command name can only consist of characters and numbers.";
        }

        if (!this.inputValidator.isValidCommandContent(content.split(' '))) {
            return "༼ง=ಠ益ಠ=༽ง You trying to play with me? This command is invalid!";
        }

        let tempCommand = {};
        tempCommand[commandName] = new CommandData(1, commandName, content);
        this.dbManager.pushValue(this.commandsDbKey, tempCommand);

        return commandName + " has been added successfully.";
    }

    delCommand(commandName: string): string {
        if (!this.checkCommandExists(commandName)) {
            return commandName + " command does not exist.";
        };

        let commandData = this.queryCommandData(commandName);

        if (commandData.native) {
            return commandName + " command can not be deleted.";
        };

        this.dbManager.removeValue('commands', (command) => command[commandName] !== undefined);

        return "the " + commandName + " command has been deleted successfully.";
    }

    updateCommand(commandName: string, newContent: string): string {
        if (!this.checkCommandExists(commandName)) {
            return commandName + " does not exist so it can not be updated.";
        };

        let commandData = this.queryCommandData(commandName);

        if (commandData.native) {
            return commandName + " can not be edited.";
        }

        commandData.content = newContent;

        let tempCommand = {};
        tempCommand[commandName] = commandData;
        this.dbManager.pushValue(this.commandsDbKey, tempCommand);

        return commandName + " has been updated successfully.";
    }

    private queryCommandData(commandName: string): CommandData {
        let commands = this.dbManager.getValue('commands') as any[];
        let commandIndex = commands.findIndex(command => command[commandName] !== undefined);
        let searchQuery = [this.commandsDbKey, commandIndex, commandName];
        return this.dbManager.querySearch<CommandData>(searchQuery);
    }

    /**Checks if a command exists.*/
    private checkCommandExists(commandName: string): boolean {
        return this.dbManager.findValue(this.commandsDbKey, (command) => command[commandName] !== undefined) !== undefined;
    }

    getLatestCommands(): any {
        return this.dbManager.getEntireDB().commands;
    }
}