const ITask = require('./ITask');

class TaskAdder extends ITask {

  constructor(){
    super();
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

				await this._TaskModel.create({
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

}

module.exports = TaskAdder;