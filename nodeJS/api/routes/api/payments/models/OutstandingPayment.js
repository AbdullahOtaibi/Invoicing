const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocalizedStringSchema = require('../../schemas/LocalizedString');

const OutstandingPaymentSchema = new Schema({
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    },
    amount: Number,
    currencyCode: String,
    date: {
        type: Date,
        default: Date.now
    },
    description: String,
    serialNumber: Number,
    paid: Boolean


}, { collection: 'OutstandingPayments' });


module.exports = OutstandingPayment = mongoose.model("OutstandingPayment", OutstandingPaymentSchema);