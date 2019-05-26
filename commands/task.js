var Task = require("../models/Task");
const task = function(args, msg){

    if(args.length == 0){
        msg.channel.send("You need to provide arguments for that commands. \nFor more information use !help task");
        return;
    }

    switch(args[0]) {
        case 'add':
            addTask(args.slice(1), msg);
            break;
        case 'list':
            listTask(args.slice(1), msg);
            break;
        default:
            msg.channel.send("Invalid arguments. For more information use !help task");
    }
}

// ADD
const addTask = (args, msg) => {
    if(args.length == 3){
        const title = args[0];
        const course = args[1];
        const date = new Date(args[2]);

        Task.create({title: title, course: course, date: date}, function(err, task){
            if(err){
                console.log(err);
            } else {
                msg.channel.send("Task added!");
            }
        });
    } else {
        msg.channel.send("Invalid arguments");
    }
}

// LIST
const listTask = (args, msg) => {

    // CHECK AND EXECUTE CASE NO ARGS
    if(args.length == 0) {
        list(msg, { completed: 'false'});

    // PROCEED WITH COMMAND USING ARGUMENTS
    } else {
        switch(args[0]) {
            case 'all':
                list(msg, {});
                break;
            case 'course':
                listByCourse(args.slice(1), msg);
                break;
            case 'due':
                listByDueDate(args.slice(1), msg);
                break;
            default:
                msg.channel.send("Invalid argument");
        }
    }
}

const list = async (msg, query) => {

    const dash = "-";
    const space = " ";

    try {
        let text = " __________________________ __________________ ________________ ____________ ________\n\
|            ID            |      TITLE       |     COURSE     |  DUE DATE  | STATUS |\n\
|__________________________|__________________|________________|____________|________|\n";

        
        let tasks = await Task.find(query);

        tasks.forEach(task => {
            let status = task.completed.includes(msg.member.user.id) ? "DONE" : "OPEN";
            let dateFormated = ('0' + task.date.getDate()).slice(-2) + '/'
                                + ('0' + (task.date.getMonth()+1)).slice(-2) + '/'
                                + task.date.getFullYear();
            
            text += `| ${task.id.padEnd(25)}| ${task.title.padEnd(17)}| ${task.course.padEnd(15)}| ${dateFormated} |  ${status}  |\n`;
        });

        text += "|__________________________|__________________|________________|____________|________|";
        text = "```" + text + "```";

        if(text){
            msg.channel.send(text);
        } else {
            msg.channel.send("No tasks available.");
        }

    } catch (err) {
        console.log(err);
    }
}

const listByDueDate = (args, msg) => {

    if(args.length == 0){
        msg.channel.send("Missing arguments. \nFor more information use !help task list");
        return;
    }

    const days = args[0];
    const today = new Date();
    const endDate = new Date().setTime( today.getTime() + days * 86400000 );

    list(msg, { date: {"$gte": today, "$lte": endDate}});

}

const listByCourse = (args, msg) => {

    if(args.length == 0){
        msg.channel.send("Missing arguments. \nFor more information use !help task list");
        return;
    }

    list(msg, { course: { $in: args }});

}

module.exports = task;