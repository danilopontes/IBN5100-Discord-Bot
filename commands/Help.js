const { prefix } = require('../config.json');
const { RichEmbed } = require('discord.js');
const Command = require('./Command');


/**
 * Help command
 * This command allows the user to get more information about a specific command.
 */
class Help extends Command {
    constructor() {
        super('help', 'Display information about the specified command', true, {
            "help": `${prefix}help <command>`
        });
    }

    
    run(args, msg) {

        this.validArgs(args);

        const { commands } = msg.client;

        const commandName = args.shift();      

        if(!commands.has(commandName)) {
            return msg.channel.send(`The command "${commandName}" do not exist, to view all available commands use !commands`);
        }

        const command = commands.get(commandName);

        const dash = "-";
        const embed = new RichEmbed()
        .setTitle(`**Command**: ${prefix + command.name}`)
        .setDescription(`${command.description}`)
        .setColor('#4286f4')
        .setThumbnail(msg.client.user.avatarURL)
        .addField(`${dash.repeat(80)}`, '__**Usage**__');

        Object.keys(command.usage).forEach(e => {
            embed.addField(`**${e}**`, command.usage[e]);
        });

        msg.channel.send(embed); 
    }
}

module.exports = Help;