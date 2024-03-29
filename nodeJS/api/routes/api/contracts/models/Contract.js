const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ContractSchema = new Schema({
    _id: ObjectId,
    seqNumber: String,
    companyID: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    } ,
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
    packageNumberOfSet: Number,
    contractBalance: Number,
    contractReminingAmount: Number,
    contractTotalReceipts:Number, 
    contractTotalInvoiced:Number,
    note: String,
    deleted: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    
    

}, { collection: 'Contracts' });

module.exports = Contract = mongoose.model("Contract", ContractSchema);