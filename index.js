require('./db');
const fs = require('fs');
const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

// MAP ALL COMMANDS
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});

// ON INIT
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('I, Robot', {type: 'WATCHING'});
});


// LISTEN TO MESSAGE
client.on('message', msg => {

    if(msg.author.bot || !msg.content.startsWith(prefix) || msg.channel.type == 'dm') return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if(!client.commands.has(commandName)) {
         return msg.channel.send('This command does not exist, for information about all available commands, use !commands');
    }

    const command = client.commands.get(commandName);

    if(command.args && !args.length) {
        let reply = `You didn't provide valid arguments.\n`;

        if(command.usage) {

            reply += 'Follow bellow the proper way to use this command:\n\n'

            Object.keys(command.usage).forEach(e => {
                reply += `**${e}** - ${command.usage[e]}\n`;
            });
        }

        return msg.channel.send(reply);
    }

    try {
        command.execute(args, msg);
    } catch (err) {
        console.log(err);
    }
});

// CONNECT BOT
client.login(token);