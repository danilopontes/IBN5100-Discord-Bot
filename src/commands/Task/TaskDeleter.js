const ITask = require('./ITask');

class TaskDeleter extends ITask {

  constructor(){
    super();
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
			const result = await this._TaskModel.findOneAndDelete({
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
}

module.exports = TaskDeleter;