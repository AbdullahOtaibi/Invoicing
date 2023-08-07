const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SubscriptionSchema = new Schema({
    _id: ObjectId,
    seqNumber: String,
    package: {
        type: ObjectId,
        ref: 'Package'
    },
    contact: {
        type: ObjectId,
        ref: 'Contact'
    },
    subscriptionDate: {
        type: Date,
        default: Date.now
    },
    subscriptionAmount: Number,
    packagePrice: Number,
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
    subscriptionBalance: Number,
    subscriptionReminingAmount: Number,
    installments: [
        {
            installmentSequance: Number,
            installmentAmount: Number,
            installmentDate: { type: Date, default: Date.now },
            installmentNote: String,
            invoice: {
                type: ObjectId,
                ref: 'Invoice'
            },
            appointment: {
                type: ObjectId,
                ref: 'FullCalendar'
            },
        }
    ],

}, { collection: 'Subscriptions' });

module.exports = Subscription = mongoose.model("Subscription", SubscriptionSchema);