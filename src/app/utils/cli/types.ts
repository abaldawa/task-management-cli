/**
 * @author Abhijit Baldawa
 */

/**
 * Target command handler function.
 *
 * @example
 * ```
 * const commandHandler: CommandHandlerFunction<[{key: string}, number]> = (
 *    objectArg,
 *    numberArg
 * ) => {
 *   // Type of objectArg = {key: string}
 *   const key = objectArg.key;
 *
 *   // Type of numberArg = number
 *   const value = numberArg.toFixed()
 * }
 * ```
 */
type CommandHandlerFunction<Args extends unknown[] = unknown[]> = (
  ...args: Args
) => Promise<void> | void;

/**
 * Generic command handler function takes in `unknown` arguments
 */
type GenericCommandHandlerFunction = CommandHandlerFunction<unknown[]>;

export { CommandHandlerFunction, GenericCommandHandlerFunction };
