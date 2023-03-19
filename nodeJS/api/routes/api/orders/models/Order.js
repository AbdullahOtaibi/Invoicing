const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({
    _id: ObjectId,
    serialNumber: Number,
    notesforClient: String,
    orderNumber: String,
    deleted: Boolean,

    totalAmount: {
        amount: Number,
        vendorAmount: Number,
        currencyCode: String
    },

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateClosed: {
        type: Date

    },
    status: {
        type: Number,
        default: 0,
        ref: 'OrderStatus'
    },

    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem'
    }],
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    actions: [{
        date: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String,

    }],
    shipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shipment'
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingAddress'
    },
    shippingCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingCompany'
    },
    shippingMethod: String


}, { collection: 'Orders' });


module.exports = Order = mongoose.model("Order", OrderSchema);