/**
 * Command object, superclass of all commands
 */
class Command {
    constructor(name, description, args, usage){
        this._name = name;
        this._description = description;
        this._args = args;
        this._usage = usage;
    }

    /**
     * Method to be run when the command is called. This method must be implemented by the subclass.
     * @param {string[]} args The array of arguments specified by the user through the command 
     * @param {Message} msg The message object of referred to the message sent 
     */
    run(args, msg) {
        throw new Error("Method not implemented");
    }

    /**
     * Checks if the command called has valid arguments.
     * @param {Array} args The array of arguments specified by the user through the command 
     */
    validArgs(args) {
        if(this._args && !args.length){
            let reply = `[Error]: You didn't provide valid arguments.\n`;

            if(this._usage) {
    
                reply += 'Follow bellow the proper way to use this command:\n\n'
    
                Object.keys(this._usage).forEach(e => {
                    reply += `**${e}** - ${this._usage[e]}\n`;
                });
            }
    
            throw new Error(reply);
        }

        return true;
    }

    /**
     * @returns {String} The name of the command.
     */
    get name(){
        return this._name;
    }

    /**
     * @returns {string} The description of the command.
     */
    get description(){
        return this._description;
    }

    /**
     * @returns {string[]} 
     */
    get args(){
        return this._args;
    }

    get usage(){
        return this._usage;
    }
}

module.exports = Command;