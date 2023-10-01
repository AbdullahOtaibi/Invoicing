const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ExpensesCategorySchema = new Schema({
    _id: ObjectId,
    companyID: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    } ,
    categoryName:String,
    defaultAmount: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "active"
    },
    
}, { collection: 'ExpensesCategories' });

//module.exports = ExpensesCategory = mongoose.model("ExpensesCategory",  ExpensesCategorySchema);
//delete mongoose.connection.models['ExpensesCategory'];
module.exports = ExpensesCategory = mongoose.model("ExpensesCategory", ExpensesCategorySchema);
