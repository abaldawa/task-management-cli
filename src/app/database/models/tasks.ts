/**
 * @author Abhijit Baldawa
 */

import * as crypto from 'node:crypto';
import * as fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Task record
 */
interface Task {
  /**
   * Unique id of task
   */
  id: string;

  /**
   * Title of the task
   */
  title: string;

  /**
   * Task description
   */
  description: string;

  /**
   * Represents the state of the task whether its
   * completed or not
   */
  status: 'COMPLETED' | 'NOT_COMPLETED';
}

const COLLECTION_FILE_NAME = 'tasks.json';
const DB_FOLDER_PATH = path.join(__dirname, '..', '..', '..', '..', 'db');
const COLLECTION_FILE_PATH = path.join(DB_FOLDER_PATH, COLLECTION_FILE_NAME);

/**
 * @private
 *
 * Central method to update tasks collection
 *
 * @param tasks - updated tasks
 */
const updateCollection = async (tasks: Task[]) =>
  fs.writeFile(COLLECTION_FILE_PATH, JSON.stringify(tasks, null, 2), {
    encoding: 'utf-8',
  });

/**
 * @public
 *
 * Creates and initializes `tasks.json` file if it
 * does not exist in the desired location
 */
const init = async () => {
  // 1. Create a db folder if it does not exist
  await fs.mkdir(DB_FOLDER_PATH, { recursive: true });

  // 2. Create db collection file if it does not exist
  const fd = await fs.open(COLLECTION_FILE_PATH, 'a+');

  // 3. Read the db collection file
  const collectionData = await fd.readFile({ encoding: 'utf-8' });

  if (!collectionData) {
    // 4. Initialize db collection file with empty data
    await fd.writeFile(JSON.stringify([]));
  }

  await fd.close();
};

const getAll = async () => {
  const collectionData = await fs.readFile(COLLECTION_FILE_PATH, {
    encoding: 'utf-8',
  });

  return JSON.parse(collectionData) as Task[];
};

const find = async <SearchCriteria>(
  searchCriterias: SearchCriteria[],
  matcherFn: (criteria: SearchCriteria, task: Readonly<Task>) => boolean,
  getNotFoundMessage: (searchCriteria: SearchCriteria) => string,
): Promise<
  { success: false; errorMessage: string } | { success: true; tasks: Task[] }
> => {
  const tasks = await getAll();
  const matchedTasks: Task[] = [];

  for (const searchCriteria of searchCriterias) {
    const foundTask = tasks.find((task) => matcherFn(searchCriteria, task));

    if (!foundTask) {
      return {
        success: false,
        errorMessage: getNotFoundMessage(searchCriteria),
      };
    }

    matchedTasks.push(foundTask);
  }

  return { success: true, tasks: matchedTasks };
};

const add = async (task: Omit<Task, 'id'>) => {
  const tasks = await getAll();
  const newTask: Task = { ...task, id: crypto.randomUUID() };

  tasks.push(newTask);
  await updateCollection(tasks);

  return newTask;
};

const remove = async (taskIds: string[]) => {
  const tasks = await getAll();
  await updateCollection(tasks.filter((task) => !taskIds.includes(task.id)));
};

const update = async (
  taskIds: string[],
  getUpdatedTask: (task: Readonly<Task>) => Task,
) => {
  const tasks = await getAll();
  const updatedTasks = tasks.map((task) => {
    if (taskIds.includes(task.id)) {
      return getUpdatedTask(task);
    }

    return task;
  });

  await updateCollection(updatedTasks);
};

export { Task, init, getAll, add, update, remove, find };
