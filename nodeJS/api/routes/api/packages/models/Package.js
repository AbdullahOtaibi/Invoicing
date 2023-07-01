const { datetime } = require('locutus/php');
const number_format = require('locutus/php/strings/number_format');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const PackageSchema = new Schema({
    _id: ObjectId,
    companyID: String,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    name: String, 
    price: Number, 
    numberOfSet:Number ,
    note:String,
    status: {
        type:String, 
        default: "Active"
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

}, { collection: 'Packages' });

module.exports = Package = mongoose.model("Package", PackageSchema);