const mongoose = require('mongoose');

const remindersSchema = new mongoose.Schema({
    cronPattern: {
        type: String,
        required: true
    },
    channelName: {
        type: String,
        required: true
    },
    due: {
        type: Number,
        required: true
    },
    guildID: {
        type: String,
        required: true
    }
}, {collection: 'reminders'});

module.exports = mongoose.model('Reminders', remindersSchema);