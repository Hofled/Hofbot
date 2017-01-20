import { CommandData, MessageData } from '../index';
import { CooldownManager } from '../../management/cooldown/cooldown-manager';

export interface IExecuter {
    execute(command: CommandData, msgData: MessageData, params?: any[]);
    cooldownManager: CooldownManager;
}