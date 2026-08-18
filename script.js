const fs = require('fs/promises'); //Required to write files
const filePath = './myTasks.json'; //Define the file name

//Format the date to the Brazilian format
function getFormattedDate() {
    return new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

//Load the JSON file
async function loadTaskFile() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        //If file does not exists
        if (error.code === 'ENOENT') {
            await fs.writeFile(filePath, JSON.stringify([], null, 2), 'utf-8');
            return [];
        }
    }
}

//Save the file with the modifications
async function saveTask(tasks) {
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
}

//Add new tasks
async function addTask(task) {
    const tasks = await loadTaskFile();

    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        description: task,
        status: "todo",
        createdAt: getFormattedDate(),
        updatedAt: getFormattedDate(),
    }

    tasks.push(newTask);
    console.log("Task added");
    await saveTask(tasks);
}

async function updateTask(id, newDescription) {
    try {
        const tasks = await loadTaskFile();

        //Takes the task by its index
        const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
        tasks[taskIndex].description = newDescription;
        tasks[taskIndex].updatedAt = getFormattedDate();

        console.log("Task updated");
        await saveTask(tasks);
    } catch (error) {
        console.error("Task not found");
    }
}

async function changeTaskStatus(id, newStatus) {
    const formatedStatus = newStatus.toLowerCase();
    if (formatedStatus !== "todo" && formatedStatus !== "doing" && formatedStatus !== "done") {
        console.error("Invalid status. Please use 'todo', 'doing', or 'done'.");
        return;
    }

    const tasks = await loadTaskFile();

    //Takes the task by its index
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    tasks[taskIndex].status = formatedStatus;
    tasks[taskIndex].updatedAt = getFormattedDate();

    console.log("Task status updated");
    await saveTask(tasks);
}

//Delete a task based on its id
async function deleteTask(id) {
    const tasks = await loadTaskFile();
    const filteredTaskList = tasks.filter(task => task.id !== parseInt(id));

    //Check if id exists in the list
    if (filteredTaskList.length == tasks.length - 1) {
        console.log("Task deleted");
        await saveTask(filteredTaskList);
    }
    else {
        console.error("Task not found");
    }
}

//Reorder the tasks to fix the id order
async function reorderTasks() {
    const tasks = await loadTaskFile();

    let counter = 1;
    for (const task of tasks) {
        task.id = counter;
        counter++;
    }

    console.log("Tasks reordered");
    await saveTask(tasks);
}

//List all tasks in the file
async function list(statusFilter, showAllDetails = false) {
    const tasks = await loadTaskFile();

    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

    //Find task by status, if provided
    let filteredTasks = tasks;
    if (statusFilter) {
        filteredTasks = tasks.filter(
            (t) => t.status.toLowerCase() === statusFilter.toLowerCase()
        );
    }
    if (filteredTasks.length === 0) {
        console.log(`No task found with status: "${statusFilter}".`);
        return;
    }

    for (const t of filteredTasks) {
        if (showAllDetails) {
            console.log(
                `${t.id} : ${t.description} | Status: ${t.status} | Created: ${t.createdAt} | Updated: ${t.updatedAt}`
            );
        } else {
            console.log(`${t.id} : ${t.description} -> ${t.status}`);
        }
    }
}

//Completly clear the list and its tasks
async function clearTasks() {
    let tasks = await loadTaskFile();
    tasks = [];
    console.log("All tasks cleared");
    await saveTask(tasks);
}

//Main function that gets the arguments in the command line
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const argument = args[1];
    const extraArgument = args[2];

    switch (command) {
        case 'add':
            if (!argument) {
                console.error("Argument not identified");
                process.exit(1);
            }

            await addTask(argument);
            break;
        case 'update':
            if (!argument || !extraArgument) {
                console.error("Argument not identified");
                process.exit(1);
            }

            await updateTask(argument, extraArgument);
            break;
        case 'delete':
            if (!argument) {
                console.error("Argument not identified");
                process.exit(1);
            }

            await deleteTask(argument);
            break;

        case 'status':
            if (!argument || !extraArgument) {
                console.error("Argument not identified");
                process.exit(1);
            }

            await changeTaskStatus(argument, extraArgument);
            break;
        case 'reorder':
            await reorderTasks();
            break;
        case 'list':
            const isFlag = (val) => val === '--all' || val === '-a';
            const showAll = isFlag(argument) || isFlag(extraArgument);

            // The status filter is whichever argument is NOT the detail flag
            let statusFilter = null;
            if (argument && !isFlag(argument)) {
                statusFilter = argument;
            } else if (extraArgument && !isFlag(extraArgument)) {
                statusFilter = extraArgument;
            }

            await list(statusFilter, showAll);
            break;
        case 'clear':
            await clearTasks();
            break;
        default:
            console.log("Command not recognized.")
            process.exit(1);
            break;
    }

    process.exit(0);
}

//Run the program with a catch for a possible error
main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});