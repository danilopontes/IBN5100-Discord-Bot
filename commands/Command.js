const { prefix } = require('../config.json');
/**
 * Command object, superclass of all commands
 */
class Command {
    constructor(client, name, description, usage){

        this.ERROR_MESSAGE = `Error: Invalid arguments, for more information use ${prefix}help ${name}`;
        this._client = client;
        this._name = name;
        this._description = description;
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

    /**
     * @returns {Object} The key value pairs with the command usage information
     */
    get usage(){
        return this._usage;
    }
}

module.exports = Command;