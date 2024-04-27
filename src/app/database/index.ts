/**
 * @author Abhijit Baldawa
 */

import * as taskModel from './models/tasks';

const init = async () => {
  await taskModel.init();
};

export { init };
