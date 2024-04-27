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
    .description('Marks task(s) as complete')
    .usage(`--title "title one" "title two"`)
    .allowExcessArguments(false)
    .requiredOption('--title <string...>', 'title of task(s) to complete')
    .action(commandHandler(completeTask as GenericCommandHandlerFunction)),

  new Command('remove')
    .description('Removes task(s) from the list')
    .usage(`--title "title one" "title two"`)
    .allowExcessArguments(false)
    .requiredOption('--title <string...>', 'title of tasks to remove')
    .action(commandHandler(removeTask as GenericCommandHandlerFunction)),
];

export { taskCommands };
