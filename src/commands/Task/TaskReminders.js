const CronJob = require('cron').CronJob;
const ITask = require('./ITask');

class TaskReminders extends ITask {

  constructor(taskLister){
    super();

		this._taskLister = taskLister;

		/** The Reminders Object which store all the CronJobs separated by guildID */
    this._reminders = {};

		/** Initializing all the existing cronjobs */
    this.initReminders();
  }

	/**
	 * This method initializes all the cronjobs and store them in the _reminders property.
	 */
	async initReminders() {

		try {

			this._client.guilds.forEach(guild => this._reminders[guild.id] = []);

			const reminders = await this._RemindersModel.find({});

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

		const reminders = await this._RemindersModel.find({
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
			const reminder = await this._RemindersModel.create({
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
			const result = await this._RemindersModel.findOneAndDelete({
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
			this._taskLister.listByDueDate([due], undefined, guild, channel);
		}, null, true, 'America/Toronto')});

	}

}

module.exports = TaskReminders;