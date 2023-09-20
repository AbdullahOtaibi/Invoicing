const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ExpensesCategorySchema = new Schema({
    _id: ObjectId,
    seqNumber: String,
    companyID: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    } ,
    year: Number,
    month: Number,
    note: String,
    details: [{ 
        id: Number,
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
    active: {
        type: Boolean,
        default: true
    },
    
    

}, { collection: 'Expenses' });

module.exports = ExpensesCategory = mongoose.model("ExpensesCategory", ExpensesCategorySchema);