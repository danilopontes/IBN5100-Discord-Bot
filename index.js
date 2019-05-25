require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(msg.content.startsWith('!')){
        const fullCommand = msg.content.substr(1);
        const arrayCommand = fullCommand.split(" ");
        const primaryCommand = arrayCommand[0];
        const args = arrayCommand.slice(1);

        processCommand(primaryCommand, args, msg);
    }
});

function processCommand(primary, args, msg){
    switch(primary) {
        case 'commands':
            commands(msg);
    }
}

// COMMANDS
function commands(msg){

    const text = `
    \`!commands\` - Display commands list;
    \`!task list\` - List all future tasks;
    \`!task list all\` - List all tasks (past and future);
    \`!task add\` - Prompt user for details and add a new task;
    \`!task delete\` - Prompt user for task ID, and delete it;
    \`!task change\` - Prompt user for details to change a task;
    `;

    msg.channel.send(text);
}

client.login(process.env.MY_TOKEN);