const fs = require('fs');
const Discord = require('discord.js');

class commandsLoader {

	static load(client) {
		client.commands = new Discord.Collection();
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && file != 'Command.js');

		commandFiles.forEach(file => {
			const Class = require(`../commands/${file}`);
			const object = new Class(client);
			client.commands.set(object.name, object);
		});
	}
}

module.exports = commandsLoader;