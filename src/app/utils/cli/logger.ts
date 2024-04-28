/**
 * @author Abhijit Baldawa
 */

import { program } from 'commander';

/**
 * Logger utility object to be used across
 * the CLI app
 */
const logger = Object.freeze({
  log: console.log,
  error: program.error.bind(program),
  clearConsole: console.clear,
});

export { logger };
