const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ExpensesSchema = new Schema({
    _id: ObjectId,
    seqNumber: String,
    companyID: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    } ,
    year: Number,
    month: Number,
    totalAmount: {
        type: Number,
        default: 0
    },
    note: String,
    details: [{ 
        id: Number,
        category: String,
        expensesCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ExpensesCategory'
        },
        amount: Number,
        createdDate: { type: Date, default: Date.now },
    }],
    deleted: {
        type: Boolean,
        default: false
    },    

}, { collection: 'Expenses' });

module.exports = Expenses = mongoose.model("Expenses",  ExpensesSchema);