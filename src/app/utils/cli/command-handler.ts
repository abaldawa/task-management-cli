/**
 * @author Abhijit Baldawa
 */

import { ExitPromptError } from '@inquirer/core';
import { GenericCommandHandlerFunction } from './types';
import { logger } from './logger';

/**
 * @public
 *
 * Central command handler. This function takes in the target command
 * handler function and returns a higher order generic command handler
 * function.
 *
 * This way we can centrally handle and log any errors/exceptions which
 * may happen in any target command handler functions.
 *
 * @param handlerFn - Function which will handle the actual command
 * @returns
 */
const commandHandler =
  (handlerFn: GenericCommandHandlerFunction): GenericCommandHandlerFunction =>
  async (...args: unknown[]) => {
    try {
      await handlerFn(...args);
    } catch (error: unknown) {
      // Handle only if the user has not manually exited on `inquirer` prompt
      if (!(error instanceof ExitPromptError)) {
        logger.error(`${error}`);
        process.exit(1);
      }
    }
  };

export { commandHandler };
