const TaskModel = require('../models/Task');
const Command = require('./Command');
const { prefix } = require('../config.json');

class Task extends Command {
    constructor(){
        super('task', 'This command allows the user to create and manage tasks.', true, {
            "add": `${prefix}task add <Title>;<Course>;<Due_date>`,
            "list": `${prefix}task list`,
            "list all": `${prefix}task list all`,
            "list course": `${prefix}task list course <Course>`,
            "list due": `${prefix}task list due <Due_date>`,
            "complete": `${prefix}task complete <id>`,
            "open": `${prefix}task open <id>`,
            "delete": `${prefix}task delete <id>`
        });
    }

    run(args, msg) {
        switch(args[0]) {
            case 'add':
                this.addTask(args.slice(1), msg);
                break;
            case 'list':
                this.listTaskManager(args.slice(1), msg);
                break;
            case 'complete':
                this.completeTask(args.slice(1), msg);
                break;
            case 'open':
                this.openTask(args.slice(1), msg);
                break;
            case 'delete':
                this.deleteTask(args.slice(1), msg);
                break;
            default:
                msg.channel.send(`Error: \'${args[0]}\' is not a valid argument. For more information use !help task`);
        }
    }

    async listTaskManager(args, msg) {

        // LIST ALL OPENED TASKS
        if(args.length == 0) {
            this.list(msg, { completed: { $ne : msg.member.user.id}});
        } else {
            switch(args[0]) {
                case 'all':
                    this.list(msg, {});
                    break;
                case 'course':
                    this.listByCourse(args.slice(1), msg);
                    break;
                case 'due':
                    this.listByDueDate(args.slice(1), msg);
                    break;
                default:
                    msg.channel.send("Invalid argument");
            }
        }
    }

    async list(msg, query) {

        try {
            let text = "                                        TASK LIST \n\
 __________________________ __________________ ________________ ____________ __________\n\
|            ID            |      TITLE       |     COURSE     |  DUE DATE  |  STATUS  |\n\
|__________________________|__________________|________________|____________|__________|\n";
    
            
            let tasks = await TaskModel.find(query).sort({date: 1});
    
            tasks.forEach(task => {
                let status = task.completed.includes(msg.member.user.id) ? "#DONE" : "[OPEN]";
                let dateFormated = ('0' + task.date.getDate()).slice(-2) + '/'
                                    + ('0' + (task.date.getMonth()+1)).slice(-2) + '/'
                                    + task.date.getFullYear();
                
                text += `| ${task.id.padEnd(25)}| ${task.title.padEnd(17)}| ${task.course.padEnd(15)}| ${dateFormated} |  ${status.padEnd(6)}  |\n`;
            });
    
            text += "|__________________________|__________________|________________|____________|__________|";
            text = "```css\n" + text + "\n```";
    
            if(tasks.length){
                msg.channel.send(text);
            } else {
                msg.channel.send("No tasks available.");
            }
    
        } catch (err) {
            console.log(err);
        }

    }

    async listByDueDate(args, msg) {
        if(!args.length){
            return msg.channel.send("Missing arguments. \nFor more information use !help task list");
        }
    
        const days = args[0];
        const today = new Date();
        const endDate = new Date().setTime( today.getTime() + days * 86400000 );
    
        this.list(msg, { date: {"$gte": today, "$lte": endDate}});
    }

    async listByCourse(args, msg) {
        if(!args.length){
        return msg.channel.send("Missing arguments. \nFor more information use !help task list");
    }

        args = args.join(" ");

        this.list(msg, { course: { $in: args }});
    }

    async addTask(args, msg) {
        args = args.join(" ").split(';');

        if(args.length == 3){
            const title = args[0];
            const course = args[1];
            const date = new Date(args[2]);

            try {

                await TaskModel.create({title: title, course: course, date: date});

                msg.channel.send("Task added!");

            } catch (err) {
                let allErrors = "Errors:";
                Object.keys(err.errors).forEach(e => {
                    if(e == 'date'){
                        allErrors += "\nInvalid date, please follow the format MM/DD/YYYY";
                    } else {
                        allErrors += "\n" +err.errors[e].message;
                    }
                });

                msg.channel.send(allErrors);
            }
        } else {
            msg.channel.send("Invalid arguments");
        }
    }

    async completeTask(args, msg) {
        if(!args.length) {
            return msg.channel.send("Missing arguments.");
        }
    
        try {
            const result = await TaskModel.findOneAndUpdate(
                { _id: args[0], completed: { $ne : msg.member.user.id}},
                { $push: { completed: msg.member.user.id }},
            );
    
            if(result == null) {
                msg.channel.send("Invalid ID, or you already completed this task.");
            } else {
                msg.channel.send("Task completed!");
            }
    
        } catch (err) {
            console.log("error " + err);
        }
    }

    async openTask(args, msg) {
        if(!args.length) {
            return msg.channel.send("Missing arguments.");
        }
    
        try {
            const result = await TaskModel.findOneAndUpdate(
                { _id: args[0], completed: msg.member.user.id},
                { $pull: { completed: msg.member.user.id }},
            );
    
            if(result == null) {
                msg.channel.send("Invalid ID, or the task is already opened.");
            } else {
                msg.channel.send("Task opened!");
            }
    
        } catch (err) {
            console.log("error " + err);
        }
    }

    async deleteTask(args, msg) {
        if(!args.length) {
            return msg.channel.send("Missing Arguments");
        }
    
        try {
            const result = await TaskModel.findByIdAndDelete(args[0]);
    
            if(result == null){
                msg.channel.send("Invalid ID");
            } else {
                msg.channel.send("Task deleted");
            }
        } catch (err){
            console.log(err);
        }
    }
}

module.exports = Task;