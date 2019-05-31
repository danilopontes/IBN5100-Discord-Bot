const { RichEmbed } = require('discord.js');
const { prefix } = require('../config.json');

module.exports = {
  name: 'commands',
  description: 'List all commands',
  args: false,
  usage: {
    "commands": `${prefix}commands`
  },
  execute(args, msg){

    const embed = new RichEmbed()
      .setTitle('IBN 5100')
      .setThumbnail(msg.client.user.avatarURL)
      .setColor('#4286f4')
      .addField('!commands', 'Display commands list;')
      .addField('!help <command>', 'Display info about the specified command;')
      .addField('!task list', 'List open tasks;')
      .addField('!task list due <days>', 'List open tasks with due date over next <days>;')
      .addField('!task list course <course_name>', 'List all tasks for the specific course;')
      .addField('!task list all', 'List all tasks (open and done);')
      .addField('!task add <title>;<course>;<due_date>', 'Add a new task;')
      .addField('!task complete <id>', 'Set your ID completed for the specific task;')
      .addField('!task open <id>', 'Unset your ID completed for the specific task')
      .setFooter('el psy congroo', msg.client.user.avatarURL)
      .setTimestamp();
    
    console.log(msg.client.user.avatarURL);

    msg.channel.send(embed);
}
};