const fs = require('fs/promises'); //Required to write files
const filePath = './myTasks.json'; //Define the file name

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
        throw error;
    }
}

//Save the file with the modifications
async function saveTask(tasks) {
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
}

//Add new tasks
async function add(task) {
    const tasks = await loadTaskFile();

    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        description: task,
        status: "Todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    tasks.push(newTask);
    console.log("Task Added");
    await saveTask(tasks);
}

//List all tasks in the file
async function list() {
    const tasks = await loadTaskFile();
    for (const t of tasks) {
        console.log(`Task ${t.id}: ${t.description} - Status: ${t.status}`);
    }
}

//Completly clear the list and its tasks
async function clear() {
    let tasks = loadTaskFile();
    tasks = [];
    await saveTask(tasks);
}

//Main function that gets the arguments in the command line
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    const argument = args[1];

    if (command === 'add') {
        if (!argument) {
            console.error("Task not identified");
            process.exit(1);
        }
        await add(argument);
    }
    else if (command == 'list') {
        await list();
    }
    else if (command == 'clear') {
        await clear();
    }
    else {
        console.log("Command not recognized.")
    }

    process.exit(0);
}

//Run the program with a catch for a possible error
main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});