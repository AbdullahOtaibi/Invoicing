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
    paymentMethod: String, 

    ObjectIdinvoice: {type:ObjectId,default :null, ref:'Invoice'},
    listOfAppliedInvoicis: {
        type: [
          {
            key1: {type:ObjectId} ,
            key2: {type:Number}
          },
        ],
        default: null
      },
    seqNumber: String, 
    receiptAmount: Number, 
    receiptBalance:Number,
    receiptAppliedAmount:{type:Number, default:0},

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
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract' 
    } ,
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

}, { collection: 'Receipts',strictPopulate: false  });

module.exports = Receipt = mongoose.model("Receipt", ReceiptSchema);