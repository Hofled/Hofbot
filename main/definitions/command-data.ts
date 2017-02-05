export class CommandData {
    name: string;
    /**The permission level required to execute this command */
    permission: number;
    /**The content of the command */
    content: string;
    /**A flag that indicates whether a command needs to go through extra processing or not*/
    internal: boolean;
    /**A flag that indicates whether a command is native and can not be changed from outer sources*/
    native: boolean;
    /**A flag that indicates if a command is a settings related command*/
    "bot-settings": boolean;
    /**A flag that indicates if a command is a casino related command*/
    casino: boolean;
    /**A flag that indicates if a command is a command-crud related command*/
    "command-crud": boolean;
    /**A flag that indicates if a command is a logging related command*/
    log: boolean;
    /**A flag that defines if a command is affected by cooldown*/
    cooldown: boolean;

    constructor(permission: number = 1, name: string, content?: string, internal: boolean = false, native: boolean = false, botSettings: boolean = false, casino: boolean = false, commandCrud: boolean = false, isLog: boolean = false, cooldown: boolean = true) {
        this.name = name;
        this.permission = permission;
        this.content = content;
        this.internal = internal;
        this.native = native;
        this["bot-settings"] = botSettings;
        this.casino = casino;
        this["command-crud"] = commandCrud;
        this.log = isLog;
        this.cooldown = cooldown;
    }
}