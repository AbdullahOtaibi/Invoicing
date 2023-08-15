const { datetime } = require('locutus/php');
const number_format = require('locutus/php/strings/number_format');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FullCalendarSchema = new Schema({
    _id: ObjectId,
    status: 
    {
        type:String, 
        default: "Scheduled"
    }, 
    companyID: String,
    contactName: String, 
    mobile:String, 
    title:String,
    note:String,
    allDay: {
        type:Boolean, 
        default:false
    },
    start: Date ,
    end: Date, 
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
    },
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    } ,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    } ,
    contact:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    } ,
    contract:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract'
    } ,
    employeeName: String, 
    employee:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    }
   
   
}, { collection: 'FullCalendar' });


module.exports = FullCalendar = mongoose.model("FullCalendar", FullCalendarSchema);