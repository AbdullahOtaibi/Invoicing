const { datetime } = require('locutus/php');
const number_format = require('locutus/php/strings/number_format');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ReceiptSchema = new Schema({
    _id: ObjectId,
    companyID: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    seqNumber: String, 
    receiptAmount: Number, 
    receiptTotalInstallments: {type: Number , default: 0} ,
    receiptReminingAmount: {type: Number , default: 0} ,
    receiptBalance:{type: Number , default: 0} ,
    receiptTotalInvoice: {type: Number , default: 0} ,
    receiptDate: {type:Date , default: Date.now} , 
    note:String,
    status: {
        type:String, 
        default: "Active"
    } ,
    contact:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    } ,
    contactName:String, 
    contactMobile:String, 
    package:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    } ,
    packageName:String, 
    packagePrice:Number, 
    packageNumberOfSet:Number ,
    installments : [
        {
            installmentSequance: Number, 
            installmentAmount: Number , 
            installmentDate:{ type: Date, default: Date.now},
            installmentNote: String,
        }
    ] , 
    deleted: {
        type:Boolean,
        default:false
    },
    createdDate: {
        type: Date,
        default: Date.now
    }, 
    updatedDate: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { collection: 'Receipts' });

module.exports = Receipt = mongoose.model("Receipt", ReceiptSchema);