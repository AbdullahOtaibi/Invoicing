const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceStatusSchema = new Schema({
    _id: Number,
    name: {
        english: String,
        arabic: String,
        turkish: String
    }

}, { collection: 'InvoiceStatus' });


module.exports = InvoiceStatus = mongoose.model("InvoiceStatus", InvoiceStatusSchema);