require('dotenv').config();
require('./db');
const Discord = require('discord.js');
const client = new Discord.Client();

// COMMANDS ENTRY POINT
const processCommand = require('./commands/processCommands');

// ON INIT
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// LISTEN TO MESSAGE
client.on('message', msg => {

    if(msg.author == client.user || !msg.content.startsWith('!') || msg.channel.type == 'dm') return;

    const fullCommand = msg.content.substr(1);
    const arrayCommand = fullCommand.split(" ");
    const primaryCommand = arrayCommand[0];
    const args = arrayCommand.slice(1);

    processCommand(primaryCommand, args, msg);
});

// CONNECT BOT
client.login(process.env.MY_TOKEN);