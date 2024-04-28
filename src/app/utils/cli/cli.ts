/**
 * @author Abhijit Baldawa
 */

import { Separator, select } from '@inquirer/prompts';

/**
 * @public
 *
 * Confirms user action via prompt
 *
 * @param confirmMessage
 * @returns Whether the action is confirmed or not
 */
const confirmAction = async (confirmMessage: string): Promise<boolean> => {
  const confirmDelete = await select<'YES' | 'NO'>({
    message: confirmMessage,
    choices: [
      new Separator(),
      {
        name: 'Yes',
        value: 'YES',
      },
      {
        name: 'No',
        value: 'NO',
      },
    ],
  });

  return confirmDelete === 'YES';
};

export { confirmAction };
