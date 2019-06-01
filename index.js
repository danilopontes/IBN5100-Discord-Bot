const fs = require('fs');
const { prefix, token } = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

// CONNECT TO DB
require('./db');

// MAP ALL COMMANDS
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') && file != 'Command.js');

// LOAD AND INITIALIZE ALL COMMANDS
commandFiles.forEach(file => {
    const Class = require(`./commands/${file}`);
    const object = new Class();
    client.commands.set(object.name, object);
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

    try {
        command.run(args, msg);
    } catch (err) {
        msg.channel.send(err.message);
    }
});

// CONNECT BOT
client.login(token);