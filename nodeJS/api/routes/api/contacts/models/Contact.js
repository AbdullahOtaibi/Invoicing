const { datetime } = require('locutus/php');
const number_format = require('locutus/php/strings/number_format');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ContactSchema = new Schema({
    _id: ObjectId,
    companyID: String,
    contactName: String, 
    contactType:String,
    mobile:String, 
    identificationType:String,
    identificationValue:String,
    email:String, 
    subContactName: String, 
    subContactMobile:String,
    subContactEmail:String,
    note:String,
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
    ,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    } , 
    contactTotalReceipt: Number,
    contactTotalInvoiced: Number,
    contactTotalBalance: Number

}, { collection: 'Contacts' });

module.exports = Contact = mongoose.model("Contact", ContactSchema);