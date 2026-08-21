# TASKS CLI

A JavaScript and Node.js program that uses CLI for a to-do list.

## Build with

- JavaScript
- Node.js

## Features

- CRUD operations with command line
- JSON file to visualize tasks

## Run

Clone the project

```bash
  git clone https://github.com/ViniQuadros/Tasks_CLI
```

Go to the project directory

```bash
  cd Tasks_CLI
```

## Use the terminal to run the commands
- Add new tasks (Use quotation marks):
```bash
  node script.js add "New Task"
```

- Update task description (Provide the index):
```bash
  node script.js update 1 "New Description"
```

- Delete task (Provide the index):
```bash
  node script.js delete 1
```

- Change the status of a task (Provide the index):
```bash
  node script.js status 1 done 
```

- List:
List all tasks:
```bash
  node script.js list
```
List tasks by status:
```bash
  node script.js list doing
```
List tasks and provide all information:
```bash
  node script.js list -a
```
```bash
  node script.js list -all
```
Both functionalities can be combined:
```bash
  node script.js list done -a
```

- Reorder tasks by index:
```bash
  node script.js reorder
```

- Clear all tasks:
```bash
  node script.js clear
```
