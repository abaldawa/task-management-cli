# task-management-cli

## Author: Abhijit Baldawa

### Description

A command-line interface (CLI) application for managing tasks. Added tasks are saved in a JSON file on the disk and are persisted across the application runs. Complete error handling for invalid commands, application errors or user input is implemented.

### Tech Stack

1. Node.js (V20.x)
2. Typescript
3. [Commander.js](https://github.com/tj/commander.js)
4. [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

### Pre-requisites

1. Latest Node.js must be installed

### How to run:

1. `git clone https://github.com/abaldawa/task-management-cli.git`
2. `cd task-management-cli`
3. execute `npm i`
4. execute `npm run build` (This will compile the project from TS to JS under `build` folder)
5. execute `node ./build/cli.js` to run the cli application and see the run option. (NOTE: Alternatively running `npm run cli -- [command] [options]` also works)

Supports below commands

- `node ./build/cli.js add`: Add a new task.
- `node ./build/cli.js list`: Display a list of all tasks.
- `node ./build/cli.js complete --titles "example title one" "example title two"`: Mark tasks as completed based on provided task titles.
- `node ./build/cli.js remove --titles "example title one" "example title two"`: Remove tasks from the list based on provided task titles.

When the application is started for the first time, `tasks.json` file is created at `task-management-cli/db/tasks.json` and on the subsequent runs the task data is picked from it and saved on it.

### Functionality in action

Below video shows the task management CLI functionality in action

https://github.com/abaldawa/task-management-cli/assets/5449692/45380a2f-f5e0-4b61-8cf4-25922a85b48c

### Design and implementation

1. The application architecture is modular and flexible hence the codebase is scalable.
2. `src/app/modules` folder contains all the supported modules/features. New feature can be easily added by adding new modules.
3. `src/app/modules/tasks` contains task management module with `command-handler.ts` exporting methods which handle the commands and `commands.ts` binds and exports all the supported commands with their associated command handler methods.
4. `src/app/database/models` contains model files related to database.
5. `src/app/database/models/tasks.ts` contains task model and it exports methods to interact with saved tasks in the `task-management-cli.git/db/tasks.json` file.
6. `src/app/commands/index.ts` exports methods which returns commands supported by all modules.
7. `src/app/utils/cli/command-handler.ts` is the central command handler. This method receives every command and then delegate it to the appropriate command handler. It also handles error in central place for all target command handlers which makes observability and logging much easier.
