/**
 * @author Abhijit Baldawa
 */

import { Separator, input, select } from '@inquirer/prompts';
import { CommandHandlerFunction } from '../../utils/cli/types';
import { logger } from '../../utils/cli/logger';
import * as taskModel from '../../database/models/tasks';

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
 * Marks task(s) as complete for the provided task titles
 *
 * @param param0
 */
const completeTask: CommandHandlerFunction<[{ title: string[] }]> = async ({
  title: taskTitlesToComplete,
}) => {
  const response = await taskModel.find(
    taskTitlesToComplete,
    (taskTitleToComplete, task) =>
      task.title.toLowerCase() === taskTitleToComplete.toLowerCase(),
    (taskTitleToComplete) => `Task title '${taskTitleToComplete}' not found`,
  );

  if (!response.success) {
    throw new Error(response.errorMessage);
  }

  const taskIdsToComplete = response.tasks.map((task) => task.id);

  await taskModel.update(taskIdsToComplete, (task) => ({
    ...task,
    status: 'COMPLETED',
  }));

  logger.log(`Marked tasks '${taskTitlesToComplete.join(', ')}' as completed`);
};

/**
 * @public
 *
 * Remove tasks by titles
 */
const removeTask: CommandHandlerFunction<[{ title: string[] }]> = async ({
  title: taskTitlesToRemove,
}) => {
  const response = await taskModel.find(
    taskTitlesToRemove,
    (taskTitleToComplete, task) =>
      task.title.toLowerCase() === taskTitleToComplete.toLowerCase(),
    (taskTitleToComplete) => `Task title '${taskTitleToComplete}' not found`,
  );

  if (!response.success) {
    throw new Error(response.errorMessage);
  }

  const taskIdsToRemove = response.tasks.map((task) => task.id);

  await taskModel.remove(taskIdsToRemove);

  logger.log(
    `Removed tasks(s) '${taskTitlesToRemove.join(', ')}' from the list`,
  );
};

export { listAllTasks, addTask, completeTask, removeTask };
