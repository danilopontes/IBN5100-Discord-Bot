const { prefix } = require('../../config.json');
const Command = require('../Command');
const TaskModel = require('../../models/Task');
const RemindersModel = require('../../models/Reminders');

class ITask extends Command {
  constructor(){
    super('task', 'This command allows the user to create and manage tasks.', {
			"task list": `${prefix}task list`,
			"task add": `${prefix}task add <Title>;<Course>;<Due_date>`,
			"task list all": `${prefix}task list all`,
			"task list course": `${prefix}task list course <Course>`,
			"task list due": `${prefix}task list due <number_of_days>`,
			"task delete": `${prefix}task delete <task_id>`,
			"task reminders add": `${prefix}task reminders add <channel_name>;<number_of_days>;<pattern>`,
			"task reminders list": `${prefix}task reminders list`,
			"task reminders delete": `${prefix}task reminders delete <Reminder_ID>` 
		});

		this._TaskModel = TaskModel;
		this._RemindersModel = RemindersModel;

  }
}

module.exports = ITask;