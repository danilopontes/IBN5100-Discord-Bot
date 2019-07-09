const { prefix, token } = require('./config.json');
const Database  = require('./db');
const commandsLoader = require('./util/commandsLoader');
const commandSelector = require('./util/commandSelector');
const Discord = require('discord.js');
const client = new Discord.Client();

// ON INIT
client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('I, Robot', { type: 'WATCHING' });

	Database.connect();
	commandsLoader.load(client);
});

// MESSAGE LISTENER
client.on('message', msg => {

	if(!commandSelector.checkIfMessageIsValidCommand(msg, client)) return;

  const args = msg.content.slice(prefix.length).split(/ +/).slice(1);
	const command = commandSelector.select(msg, client);

	try {
		command.run(args, msg);
	} catch (err) {
		msg.channel.send(err.message);
	}
});

// CONNECT BOT
client.login(token);

module.exports = { client };