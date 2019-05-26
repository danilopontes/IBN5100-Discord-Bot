var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    completed: [{
        type: String,
    }]
}, {collection: 'task'});

module.exports = mongoose.model('Task', taskSchema);