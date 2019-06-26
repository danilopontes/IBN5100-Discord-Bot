const Command = require('./Command');
const CronJob = require('cron').CronJob;
const TaskModel = require('../models/Task');
const RemindersModel = require('../models/Reminders');
const { prefix } = require('../config.json');

/**
 * Task command
 * This command is used to execute different actions related to a Task
 */
class Task extends Command {

	constructor(client) {
		super(client, 'task', 'This command allows the user to create and manage tasks.', {
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

		/**
		 * The Reminders Object which store all the CronJobs separated by guildID
		 */
		this._reminders = {};

		this.initReminders();
	}
	/**
	 * Method to be run when the command is called.
	 * @param {string[]} args The array of arguments specified by the user through the command 
	 * @param {Message} msg The message object referred to the message sent 
	 */
	run(args, msg) {

		switch (args[0]) {
			case 'add':
				this.addTask(args.slice(1), msg);
				break;
			case 'list':
				this.listManager(args.slice(1), msg);
				break;
			case 'delete':
				this.deleteTask(args.slice(1), msg);
				break;
			case 'reminders':
				this.remindersManager(args.slice(1), msg);
				break;
			default:
				msg.channel.send(this.ERROR_MESSAGE);
		}
	}

	/**
	 * This method read the !task list command and call the correct method according to the arguments passed.
	 * @param {string[]} args The array of arguments specified by the user through the command .
	 * @param {Message} msg The message object referred to the message sent
	 */
	listManager(args, msg) {

		if (!args.length) {
			this.list(msg, { date: { $gte: new Date()	}	});
		} else {
			switch (args[0]) {
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
					msg.channel.send(this.ERROR_MESSAGE);
			}
		}
	}

	/**
	 * This method fetchs the database according to the query, and display the data in a table layout
	 * @param {*} msg The message object referred to the message sent
	 * @param {*} query The query to be performed when searching data from db
	 * @param {*} guild The guild referred to the reminder
	 * @param {*} channel The channel referred to the reminder
	 */
	async list(msg, query, guild, channel) {

		const tableHeader = "                                        TASK LIST \n\
 __________________________ __________________ ________________ ____________\n\
|            ID            |      TITLE       |     COURSE     |  DUE DATE  |\n\
|__________________________|__________________|________________|____________|\n";
	 const tableEmptyBody = "|                                       EMPTY LIST                                     |\n";
	 const tableFooter = "|___________________________________________________________________________|";


		// INCLUDE GUILD PARAM TO QUERY
		query.guildID = (guild === undefined) ? msg.guild.id : guild.id;



		try {

			let text = tableHeader;

			const tasks = await TaskModel.find(query).sort({
				date: 1
			});

			if (!tasks.length) {
				if(guild === undefined && channel === undefined){
					text += tableEmptyBody;
				} else {
					return console.log("Nothing to show.");
				}
			} else {

				tasks.forEach(task => {
					let dateFormated = ('0' + task.date.getDate()).slice(-2) + '/' +
						('0' + (task.date.getMonth() + 1)).slice(-2) + '/' +
						task.date.getFullYear();

					text += `| ${task.id.padEnd(25)}| ${task.title.padEnd(17)}| ${task.course.padEnd(15)}| ${dateFormated} |\n`;
				});

			}

			text += tableFooter;
			text = "```css\n" + text + "\n```";

			if (channel) {
				channel.send(text);
			} else {
				msg.channel.send(text);
			}

		} catch (err) {
			console.log(err);
		}

	}

	/**
	 * This method is called when the user chooses to list the available tasks by due date.
	 * For example, if the argument specified in the command is 15, all tasks that is due during the next 15 days will be displayed.
	 * This method is also called by the Reminders object according to each reminder that is setted.
	 * @param {string[]} args The array of arguments specified by the user through the command
	 * @param {Message} msg The message object referred to the message sent (undefined case the method is called by a reminder)
	 * @param {Guild} guild The guild object referred to the reminder
	 * @param {Channel} channel The channel object referred to the reminder
	 */
	listByDueDate(args, msg, guild, channel) {

		if (!args.length) {
			return msg.channel.send(this.ERROR_MESSAGE);
		}

		const days = args[0];
		const startDate = new Date();
		const endDate = new Date().setTime(startDate.getTime() + days * 86400000);

		this.list(msg, {
			date: {
				"$gte": startDate,
				"$lte": endDate
			}
		}, guild, channel);
	}

	/**
	 * This method is called when the user chooses to list tasks for a specific course
	 * @param {string[]} args The array of arguments specified by the user through the command
	 * @param {Message} msg The message object referred to the message sent (undefined case the method is called by a reminder)
	 */
	listByCourse(args, msg) {
		if (!args.length) {
			return msg.channel.send(this.ERROR_MESSAGE);
		}

		args = args.join(" ");

		this.list(msg, {
			course: {
				$in: args
			}
		});
	}

	/**
	 * This method add new tasks to the database
	 * @param {string[]} args The array of arguments specified by the user through the command
	 * @param {Message} msg The message object referred to the message sent (undefined case the method is called by a reminder)
	 */
	async addTask(args, msg) {
		args = args.join(" ").split(';');

		if (args.length == 3) {
			const title = args[0];
			const course = args[1];
			const date = new Date(args[2]);
			const guildID = msg.guild.id;

			try {

				await TaskModel.create({
					title: title,
					course: course,
					date: date,
					guildID: guildID
				});

				msg.channel.send("Task added!");

			} catch (err) {
				let allErrors = "Errors:";
				Object.keys(err.errors).forEach(e => {
					if (e == 'date') {
						allErrors += "\nInvalid date, please follow the format MM/DD/YYYY";
					} else {
						allErrors += "\n" + err.errors[e].message;
					}
				});

				msg.channel.send(allErrors);
			}
		} else {
			return msg.channel.send(this.ERROR_MESSAGE);
		}
	}

	/**
	 * This method deletes an exising task
	 * @param {string[]} args The array of arguments specified by the user through the command
	 * @param {Message} msg The message object referred to the message sent (undefined case the method is called by a reminder)
	 */
	async deleteTask(args, msg) {
		if (!args.length) {
			return msg.channel.send(this.ERROR_MESSAGE);
		}

		try {
			const guildID = msg.guild.id;
			const result = await TaskModel.findOneAndDelete({
				_id: args[0],
				guildID: guildID
			});

			if (result == null) {
				msg.channel.send("Invalid ID");
			} else {
				msg.channel.send("Task deleted");
			}
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * This method initializes all the cronjobs and store them in the _reminders property.
	 */
	async initReminders() {

		try {

			this._client.guilds.forEach(guild => this._reminders[guild.id] = []);

			const reminders = await RemindersModel.find({});

			reminders.forEach(reminder => {
				const guild = this._client.guilds.get(reminder.guildID);
				const channel = guild.channels.find(channel => channel.name === reminder.channelName);
				const cronPattern = reminder.cronPattern;
				const due = reminder.due;

				this.pushNewCronJob(reminder._id, due, guild, channel, cronPattern);
				console.log(`Reminder ${reminder._id} loaded. Pattern: ${reminder.cronPattern}`);
				
			});
			
			console.log(this._reminders);

		} catch (err) {
			console.log(err);
		}
	}

	/**
	 * This method read the !task reminders command and call the correct method according to the message arguments.
	 * @param {string[]} args The array of arguments specified by the user through the command .
	 * @param {Message} msg The message object referred to the message sent
	 */
	remindersManager(args, msg) {

		switch (args[0]) {
			case 'list':
				this.listReminders(msg);
				break;
			case 'add':
				this.addReminder(args.slice(1), msg);
				break;
			case 'delete':
				this.deleteReminder(args.slice(1), msg);
				break;
			default:
				msg.channel.send(this.ERROR_MESSAGE);

		}
	}

	/**
	 * Lists all the task reminders available for the guild
	 * @param {Message} msg - The message object referred to the message sent 
	 */
	async listReminders(msg) {

		const guildID = msg.guild.id;

		const reminders = await RemindersModel.find({
			guildID: guildID
		});

		let text = "";

		reminders.forEach(reminder => {
			// console.log(reminder);
			text += `ID: ${reminder._id} Pattern: ${reminder.cronPattern} Due: ${reminder.due} Channel: ${reminder.channelName}`
		});
	
		console.log(this._reminders);
		if(!reminders.length){
			msg.channel.send("There is currently no reminders setted.");
		} else {
			msg.channel.send(text);
		}
	}

	/**
	 * Add a new task reminder for the guild
	 * @param {string[]} args The array of arguments specified by the user through the command .
	 * @param {Message} msg - The message object referred to the message sent 
	 */
	async addReminder(args, msg) {

		args = args.join(" ").split(";");

		if (args.length != 3) {
			return msg.channel.send(this.ERROR_MESSAGE);
		}

		const channelName = args[0];
		const due = args[1];
		const cronPattern = args[2];
		const guild = msg.guild;
		const channel = guild.channels.find(channel => channel.name === channelName);

		try {
			const reminder = await RemindersModel.create({
				cronPattern: cronPattern,
				channelName: channelName,
				due: due,
				guildID: guild.id
			});

			this.pushNewCronJob(reminder._id, due, guild, channel, cronPattern);

			msg.channel.send("Reminder added!");

			console.log(this._reminders);

		} catch (err) {
			let allErrors = "Errors:";
			Object.keys(err.errors).forEach(e => {
				allErrors += "\n" + err.errors[e].message;
			});

			msg.channel.send(allErrors);
		}

	}
	/**
	 * Delete an existing reminder of the guild where the message was originated
	 * @param {string[]} args The array of arguments specified by the user through the command .
	 * @param {Message} msg - The message object referred to the message sent 
	 */
	async deleteReminder(args, msg){

		if (!args.length) {
			return msg.channel.send(this.ERROR_MESSAGE);
		}

		try {
			const guildID = msg.guild.id;
			const result = await RemindersModel.findOneAndDelete({
				_id: args[0],
				guildID: guildID
			});

			if (result == null) {
				msg.channel.send("Invalid ID");
			} else {

				const reminderToBeDeleted = this._reminders[guildID].find(reminder => {
					return reminder.reminderID == result._id
				});

				reminderToBeDeleted.cron.context.stop();
				this._reminders[guildID] = this._reminders[guildID].filter(reminder => reminder.reminderID != result._id);
				msg.channel.send("Reminder deleted");
				console.log(this._reminders);
			}
		} catch (err) {
			console.log(err);
		}

	}
	/**
	 * Pushs a CronJob to the object array _reminders
	 * @param {int} due The due date for the specified reminder
	 * @param {Guild} guild The guild object referred to the CronJob
	 * @param {Channel} channel The channel object referred to the CronJob
	 * @param {string} cronPattern The Cron pattern specified
	 */
	pushNewCronJob(reminderID, due, guild, channel, cronPattern){
		this._reminders[guild.id].push({"reminderID": `${reminderID}`, "cron": new CronJob(cronPattern, () => {
			console.log(`Cron ${cronPattern} executed!`);
			this.listByDueDate([due], undefined, guild, channel);
		}, null, true, 'America/Toronto')});

	}

}

module.exports = Task;