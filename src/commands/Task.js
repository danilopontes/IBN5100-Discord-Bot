const ITask = require('./Task/ITask');
const TaskAdder = require('./Task/TaskAdder');
const TaskReminders = require('./Task/TaskReminders');
const TaskLister = require('./Task/TaskLister');
const TaskDeleter = require('./Task/TaskDeleter');

/**
 * Task command
 * This command is used to perform different actions related to a Task
 */
class Task extends ITask {

	constructor() {
		super();

		this._taskLister = new TaskLister();
		this._taskAdder = new TaskAdder();
		this._taskDeleter = new TaskDeleter();
		this._taskReminders = new TaskReminders(this._taskLister);
	}
	/**
	 * Method to be run when the command is called.
	 * @param {string[]} args The array of arguments specified by the user through the command 
	 * @param {Message} msg The message object referred to the message sent 
	 */
	run(args, msg) {

		switch (args[0]) {
			case 'add':
				this._taskAdder.addTask(args.slice(1), msg);
				break;
			case 'list':
				this._taskLister.listManager(args.slice(1), msg);
				break;
			case 'delete':
				this._taskDeleter.deleteTask(args.slice(1), msg);
				break;
			case 'reminders':
				this._taskReminders.remindersManager(args.slice(1), msg);
				break;
			default:
				msg.channel.send(this.ERROR_MESSAGE);
		}
	}
}

module.exports = Task;