/**
 * @author Abhijit Baldawa
 */

import { Command } from 'commander';
import { taskCommands } from '../modules/tasks/commands';

/**
 * @public
 *
 * Returns all supported commands for the entire
 * CLI app
 */
const getAllCommands = (): Command[] => {
  return [...taskCommands];
};

export { getAllCommands };
