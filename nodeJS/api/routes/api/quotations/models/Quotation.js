const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const QuotationSchema = new Schema({
    _id: ObjectId,
    quotationNumber: String,
    serialNumber: Number,
    deleted: Boolean,
    totalAmount: {
        amount: Number,
        currencyCode: String
    },

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    guest: {
        name: String,
        email: String,
        phone: String,
        message: String
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 1,
        ref: 'OrderStatus'
    },

    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuotationItem'
        }]


}, { collection: 'Quotations' });


module.exports = Quotation = mongoose.model("Quotation", QuotationSchema);