const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const LogsSchema = new Schema({
    _id: ObjectId,
    message: String,
    ipAddress: String,

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    logDate: {
        type: Date,
        default: Date.now
    },




}, { collection: 'Logs' });


module.exports = Logs = mongoose.model("Logs", LogsSchema);