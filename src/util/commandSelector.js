const { prefix } = require('../config.json');

class commandSelector {

  constructor(){
    this._commandName;
  }

  static select(msg, client){
    return client.commands.get(this._commandName);
  }

  static checkIfMessageIsValidCommand(msg, client){

    if (msg.author.bot || !msg.content.startsWith(prefix) || msg.channel.type == 'dm') return false;

    const args = msg.content.slice(prefix.length).split(/ +/);
    this._commandName = args.shift().toLowerCase();

    if (!client.commands.has(this._commandName)) {
      msg.channel.send('This command does not exist, for information about all available commands, use !commands');
      return false;
    }
    
    return true;
  }  
}

module.exports = commandSelector;