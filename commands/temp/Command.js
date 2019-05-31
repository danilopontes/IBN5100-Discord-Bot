class Command {
    constructor(name, description, args){
        this._name = name;
        this._description = description;
        this._args = args;
        this._usage = {};
    }

    run(args, msg) {
        throw new Error("Method not implemented");
    }

    get name(){
        return this._name;
    }

    get description(){
        return this._description;
    }

    get args(){
        return this._args;
    }

    get usage(){
        return this._usage;
    }

    set usage(value) {
        this.usage = value;
    }
}

module.exports = Command;