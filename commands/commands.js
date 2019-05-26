const { RichEmbed } = require('discord.js');

const commands = function(msg){

    const text = 
    
   `All available commands:
   
    **!commands** - Display commands list;
    **!task list** - List all future tasks;
    **!task list all** - List all tasks (past and future);
    **!task add** - Prompt user for details and add a new task;
    **!task delete** - Prompt user for task ID, and delete it;
    **!task change** - Prompt user for details to change a task;`;


    const embed = new RichEmbed()
      .setTitle('!commands')
      .setColor(0xFF0000)
      .setDescription(text);

    msg.channel.send(embed);
}

module.exports = commands;