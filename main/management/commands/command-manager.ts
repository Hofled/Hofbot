import { CommandData } from '../../definitions/command-data';
import { InputValidator } from '../../functionality/input/input-validator';
import { FileHandler } from '../../functionality/files/index';

/**
 * This class is responsible for storing all the commands and managing them, performing operations such as deleting and adding new commands
 */
export class CommandManager {
    private inputValidator: InputValidator;
    private fileHandler: FileHandler;
    private readonly commandsFile: string = 'main/management/commands/storage/commands.json';

    constructor(inputValidator: InputValidator, fileHandler: FileHandler) {
        this.fileHandler = fileHandler;
        this.inputValidator = inputValidator;
    }

    /**Returns a CommandData object according to the passed command name.*/
    getCommandData(commandName: string, commands: any): CommandData | boolean {
        if (!this.checkCommandExists(commandName, commands)) return false;
        let command = commands[commandName];
        return command;
    }

    addCommand(commandName: string, content: string, commands: any): string {
        if (this.checkCommandExists(commandName, commands)) {
            return commandName + " already exists.";
        }

        if (!this.inputValidator.isValidCommandName(commandName)) {
            return "A command can only consist of characters and numbers.";
        }

        if (!this.inputValidator.isValidCommandContent(content.split(' '))) {
            return "༼ง=ಠ益ಠ=༽ง You trying to play with me? This command is invalid!";
        }

        commands[commandName] = new CommandData(1, commandName, content);

        this.updateCommandsFile(commands);

        return commandName + " has been added successfully.";
    }

    delCommand(commandName: string, commands: any): string {
        if (!this.checkCommandExists(commandName, commands)) {
            return commandName + " command does not exist.";
        };

        if (commands[commandName].native) {
            return commandName + " command can not be deleted.";
        };

        delete commands[commandName];

        this.updateCommandsFile(commands);

        return commandName + " command has been deleted successfully.";
    }

    updateCommand(commandName: string, newContent: string, commands: any): string {
        if (!this.checkCommandExists(commandName, commands)) {
            return commandName + " does not exist so it can not be updated.";
        };

        let command = commands[commandName] as CommandData;

        if (command.native) {
            return commandName + " can not be edited.";
        }

        commands[commandName].content = newContent;

        this.updateCommandsFile(commands);

        return commandName + " has been updated successfully.";
    }

    /**Writes the new object to the json file */
    private updateCommandsFile(newCommands: any) {
        this.fileHandler.writeObjToFileSync(newCommands, this.commandsFile);
    }

    /**Checks if a command exists.*/
    private checkCommandExists(commandName: string, commands: any): boolean {
        return (commandName in commands);
    }

    getLatestCommands(): any {
        return this.fileHandler.readFileSync(this.commandsFile);
    }
}