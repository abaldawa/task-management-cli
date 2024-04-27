/**
 * @author Abhijit Baldawa
 */

import { program } from 'commander';
import { getAllCommands } from './app/commands';
import * as db from './app/database';
import { logger } from './app/utils/cli/logger';

const start = async () => {
  try {
    // Initialize DB
    await db.init();

    // Get all supported commands
    const commands = getAllCommands();

    // Add cli description
    program.description('CLI for task management');

    // Attach all commands to commander interface
    commands.forEach((command) => {
      program.addCommand(command);
    });

    // Process command
    await program.parseAsync(process.argv);
  } catch (error: unknown) {
    logger.error(`Error occurred. ${error}`);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

export { start };
