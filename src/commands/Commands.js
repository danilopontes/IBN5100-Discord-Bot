const {	RichEmbed } = require('discord.js');
const {	prefix } = require('../config.json');
const Command = require('./Command');

/**
 * Commands command
 * This command display a list of all available commands.
 */
class Commands extends Command {
	constructor() {
		super('commands', 'Display a list of available commands.', {
			"commands": `${prefix}commands`
		})
	};

	/**
	 * Method to be run when the command is called.
	 * @param {string[]} args The array of arguments specified by the user through the command 
	 * @param {Message} msg The message object of referred to the message sent 
	 */
	run(args, msg) {

		const embed = new RichEmbed()
			.setTitle('IBN 5100')
			.setThumbnail(msg.client.user.avatarURL)
			.setColor('#4286f4')
			.setFooter('el psy congroo', msg.client.user.avatarURL)
			.setTimestamp();

		const dash = '-';
		msg.client.commands.forEach(command => {
			embed.addField(`${dash.repeat(80)}`, `**Command:** ${prefix + command.name}`);

			Object.keys(command.usage).forEach(item => {
				embed.addField(item, command.usage[item]);
			});

		});

		msg.channel.send(embed);
	}

}

module.exports = Commands;