const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ContractSchema = new Schema({
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
    contractDate: {
        type: Date,
        default: Date.now
    },
    contractAmount: Number,
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
    contractBalance: Number,
    contractReminingAmount: Number,
    installments: [
        {
            installmentSequance: Number,
            installmentAmount: Number,
            installmentDate: { type: Date, default: Date.now },
            expectedDate: { type: Date, default: Date.now },
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

}, { collection: 'Contracts' });

module.exports = Contract = mongoose.model("Contract", ContractSchema);