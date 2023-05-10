const { datetime } = require('locutus/php');
const number_format = require('locutus/php/strings/number_format');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const FullCalendarSchema = new Schema({
    _id: ObjectId,
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
    }
   
   
}, { collection: 'FullCalendar' });


module.exports = FullCalendar = mongoose.model("FullCalendar", FullCalendarSchema);