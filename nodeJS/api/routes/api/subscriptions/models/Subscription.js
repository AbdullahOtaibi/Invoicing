const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SubscriptionSchema = new Schema({
    _id: ObjectId,
    package: {
        type: ObjectId,
        ref: 'Package'
    },
    client: {
        type: ObjectId,
        ref: 'User'
    },
    subscriptionDate: {
        type: Date,
        default: Date.now
    },
    amount: Number,
    numberOfSet: Number,
    note: String,
    deleted: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },


}, { collection: 'Subscriptions' });

module.exports = Subscription = mongoose.model("Subscription", SubscriptionSchema);