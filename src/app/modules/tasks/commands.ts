/**
 * @author Abhijit Baldawa
 */

import { Command } from 'commander';
import { GenericCommandHandlerFunction } from '../../utils/cli/types';
import {
  addTask,
  completeTask,
  listAllTasks,
  removeTask,
} from './command-handlers';
import { commandHandler } from '../../utils/cli/command-handler';

/**
 * All supported task commands
 */
const taskCommands: Command[] = [
  new Command('add')
    .description('Add a new task')
    .allowExcessArguments(false)
    .action(commandHandler(addTask as GenericCommandHandlerFunction)),

  new Command('list')
    .description('Lists all saved tasks')
    .allowExcessArguments(false)
    .action(commandHandler(listAllTasks as GenericCommandHandlerFunction)),

  new Command('complete')
    .description('Mark tasks as complete')
    .allowExcessArguments(false)
    .action(commandHandler(completeTask as GenericCommandHandlerFunction)),

  new Command('remove')
    .description('Remove tasks from the list')
    .allowExcessArguments(false)
    .action(commandHandler(removeTask as GenericCommandHandlerFunction)),
];

export { taskCommands };
