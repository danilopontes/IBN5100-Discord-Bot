const ITask = require('./ITask');

class TaskLister extends ITask {

  constructor(){
    super();
  }
  

	/**
	 * This method read the !task list command and call the correct method according to the arguments passed.
	 * @param {string[]} args The array of arguments specified by the user through the command .
	 * @param {Message} msg The message object referred to the message sent
	 */
	listManager(args, msg) {

		if (!args.length) {
			this.list(msg, { date: { $gte: new Date()	}});
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

			const tasks = await this._TaskModel.find(query).sort({
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

					const month = ('0' + (task.date.getMonth() + 1)).slice(-2);
					const day = ('0' + task.date.getDate()).slice(-2);
					const year = task.date.getFullYear();
					const dateFormated =  `${month}/${day}/${year}`;

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
}

module.exports = TaskLister;