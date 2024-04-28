/**
 * @author Abhijit Baldawa
 */

import { Separator, input, select } from '@inquirer/prompts';
import { CommandHandlerFunction } from '../../utils/cli/types';
import { logger } from '../../utils/cli/logger';
import { confirmAction } from '../../utils/cli/cli';
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

    logger.clearConsole();
  }
};

/**
 * @public
 *
 * Adds task to the task list
 */
const addTask: CommandHandlerFunction<never> = async () => {
  while (true) {
    const newTask: Omit<taskModel.Task, 'id'> = {
      title: await input({
        message: 'Enter task name',
        validate: (value) => {
          return !value.trim() ? 'Task name cannot be empty' : true;
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

    const addMore = await confirmAction('Do you want to add more tasks?');

    if (!addMore) {
      break;
    }
  }
};

/**
 * @public
 *
 * Mark task as complete based on user selection
 */
const completeTask: CommandHandlerFunction<never> = async () => {
  let incompleteTasks: taskModel.Task[] | undefined;
  let wasTaskCompleted = false;

  while (true) {
    if (!incompleteTasks || wasTaskCompleted) {
      const tasks = await taskModel.getAll();

      incompleteTasks = tasks.filter((task) => task.status === 'NOT_COMPLETED');
      wasTaskCompleted = false;
    }

    const taskIdToCompleteOrExit = await select<(string & {}) | 'EXIT'>({
      message: incompleteTasks.length
        ? 'Select a task to complete'
        : 'No incomplete task found',
      choices: [
        ...incompleteTasks.map((task) => ({
          value: task.id,
          name: task.title,
          description: task.description,
        })),
        new Separator(),
        {
          name: 'Exit',
          value: 'EXIT',
        },
      ],
    });

    if (taskIdToCompleteOrExit === 'EXIT') {
      break;
    }

    await taskModel.update((task) => {
      if (taskIdToCompleteOrExit === task.id) {
        return {
          ...task,
          status: 'COMPLETED',
        };
      }
      return task;
    });

    wasTaskCompleted = true;

    logger.clearConsole();
  }
};

/**
 * @public
 *
 * Remove task based on user selection
 */
const removeTask: CommandHandlerFunction<never> = async () => {
  let tasks: taskModel.Task[] | undefined;
  let wasTaskRemoved = false;

  while (true) {
    if (!tasks || wasTaskRemoved) {
      tasks = await taskModel.getAll();
      wasTaskRemoved = false;
    }

    const taskIdToRemoveOrExit = await select<(string & {}) | 'EXIT'>({
      message: tasks.length
        ? 'Select a task to remove'
        : 'No task available to remove',
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

    if (taskIdToRemoveOrExit === 'EXIT') {
      break;
    }

    const confirmDelete = await confirmAction('Confirm remove?');

    if (confirmDelete) {
      await taskModel.remove((task) => task.id === taskIdToRemoveOrExit);
      wasTaskRemoved = true;
    }

    logger.clearConsole();
  }
};

export { listAllTasks, addTask, completeTask, removeTask };
