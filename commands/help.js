const { prefix } = require('../config.json');
const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Show help information about a specific command',
    args: true,
    usage: {
        "help": `${prefix}help <command>`
    },
    execute(args, msg) {
        const { commands } = msg.client;

        const commandName = args.shift();       

        if(!commands.has(commandName)) {
            return msg.channel.send("Invalid command, to view all available commands use !commands");
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