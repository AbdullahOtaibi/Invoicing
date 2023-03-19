const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocalizedStringSchema = require('../../schemas/LocalizedString');

const PaymentsSchema = new Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    },
    date: {
        type: Date,
        default: Date.now
    },
    referenceId: String,
    transactionId: String,
    authCode: String,
    transactionDate: {
        type: Date,
        default: Date.now
    },
    paymentId: String,
    responseCode: String,
    trackingId: String,
    status: String,
    amount: Number,
    currencyCode: String,
    udf1: String,
    postdate: String,
    paymentMethod: String,
    serialNumber: Number


}, { collection: 'Payments' });


module.exports = Payment = mongoose.model("Payment", PaymentsSchema);