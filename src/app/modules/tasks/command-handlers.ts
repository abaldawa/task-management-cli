/**
 * @author Abhijit Baldawa
 */

import { Separator, input, select } from '@inquirer/prompts';
import { CommandHandlerFunction } from '../../utils/cli/types';
import { logger } from '../../utils/cli/logger';
import * as taskModel from '../../database/models/tasks';

/**
 * @private
 *
 * Finds tasks id by task titles
 *
 * @param taskTitles
 * @returns
 */
const findTaskIdsByTaskTitles = async (
  taskTitles: string[],
): Promise<string[]> => {
  const tasks = await taskModel.getAll();
  const matchedTaskIds: string[] = [];

  for (const taskTitle of taskTitles) {
    const foundTask = tasks.find(
      (task) => task.title.toLowerCase() === taskTitle.toLowerCase(),
    );

    if (!foundTask) {
      throw new Error(`Task title '${taskTitle}' not found`);
    }

    matchedTaskIds.push(foundTask.id);
  }

  return matchedTaskIds;
};

/**
 * @public
 *
 * Lists all the available tasks
 */
const listAllTasks: CommandHandlerFunction<never> = async () => {
  const tasks = await taskModel.getAll();

  if (!tasks.length) {
    logger.log('No tasks to show');
    return;
  }

  while (true) {
    const selection = await select<(string & {}) | 'EXIT'>({
      message: 'List of all tasks',
      choices: [
        ...tasks.map((task) => ({
          value: task.id,
          name: `${task.status === 'COMPLETED' ? '[✅]' : '[ ]'} ${task.title}`,
          description: task.description,
        })),
        new Separator(),
        {
          name: 'Exit',
          value: 'EXIT',
        },
      ],
    });

    if (selection === 'EXIT') {
      break;
    }

    console.clear();
  }
};

/**
 * @public
 *
 * Adds task to the task list
 */
const addTask: CommandHandlerFunction<never> = async () => {
  const tasks = await taskModel.getAll();

  const newTask: Omit<taskModel.Task, 'id'> = {
    title: await input({
      message: 'Enter task name',
      validate: (value) => {
        if (!value.trim()) {
          return 'Task name cannot be empty';
        }

        const existingTask = tasks.find(
          (task) => task.title.toLowerCase() === value.toLowerCase(),
        );

        return existingTask
          ? `Task with title '${existingTask.title}' already exists`
          : true;
      },
    }),
    description: await input({
      message: 'Enter task description',
      validate: (value) => {
        return !value.trim() ? 'Task description cannot be empty' : true;
      },
    }),
    status: 'NOT_COMPLETED',
  };

  await taskModel.add(newTask);

  logger.log(`Task '${newTask.title}' added successfully`);
};

/**
 * @public
 *
 * Mark tasks as complete for the provided task titles
 */
const completeTask: CommandHandlerFunction<[{ titles: string[] }]> = async ({
  titles: taskTitlesToComplete,
}) => {
  const taskIdsToComplete = await findTaskIdsByTaskTitles(taskTitlesToComplete);

  await taskModel.update((task) => {
    if (taskIdsToComplete.includes(task.id)) {
      return {
        ...task,
        status: 'COMPLETED',
      };
    }

    return task;
  });

  logger.log(`Marked tasks '${taskTitlesToComplete.join(', ')}' as completed`);
};

/**
 * @public
 *
 * Remove tasks by titles
 */
const removeTask: CommandHandlerFunction<[{ titles: string[] }]> = async ({
  titles: taskTitlesToRemove,
}) => {
  const taskIdsToRemove = await findTaskIdsByTaskTitles(taskTitlesToRemove);

  await taskModel.remove((task) => taskIdsToRemove.includes(task.id));

  logger.log(
    `Removed tasks(s) '${taskTitlesToRemove.join(', ')}' from the list`,
  );
};

export { listAllTasks, addTask, completeTask, removeTask };
