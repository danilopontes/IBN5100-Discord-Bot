const task = require('./task');
const commands = require('./commands')

const processCommand = function(primary, args, msg){
    switch(primary) {
        case 'commands':
            commands(msg);
            break;
        case 'task':
            task(args, msg);
            break;
    }
}

module.exports = processCommand;