const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const MessageQueueSchema = new Schema({
    _id: {
        type: ObjectId,
        default: new mongoose.Types.ObjectId()

    },
    subject: String,
    recipients: [String],
    messageBody: String,
    sent: {
        type: Boolean,
        default: false
    },
    seen: {
        type: Boolean,
        default: false
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateSent: Date,
    retries: Number,
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { collection: 'MessageQueue' });



module.exports = MessageQueue = mongoose.model("MessageQueue", MessageQueueSchema);