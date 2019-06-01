const { RichEmbed } = require('discord.js');
const { prefix } = require('../config.json');
const Command = require('./Command');

/**
 * Commands command
 * This command display a list of all available commands.
 */
class Commands extends Command {
    constructor() {
        super('commands', 'Display a list of available commands.', false, {
            "commands": `${prefix}commands`
        })
    };


    run(args, msg) {

        const embed = new RichEmbed()
        .setTitle('IBN 5100')
        .setThumbnail(msg.client.user.avatarURL)
        .setColor('#4286f4')
        .setFooter('el psy congroo', msg.client.user.avatarURL)
        .setTimestamp();

        const dash = '-';
        msg.client.commands.forEach(command => {
            embed
            .addField(`${dash.repeat(80)}`, `**Command:** ${prefix + command._name}`);

            Object.keys(command._usage).forEach(item => {
                embed.addField(item, command._usage[item]);
            });

        });
  
      msg.channel.send(embed);
    }

}

module.exports = Commands;