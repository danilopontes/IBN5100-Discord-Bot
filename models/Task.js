var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: [16, 'Title must be at maximum 16 length']
    },
    course: {
        type: String,
        required: true,
        maxlength: [14, 'Course must be at maximum 14 length']
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