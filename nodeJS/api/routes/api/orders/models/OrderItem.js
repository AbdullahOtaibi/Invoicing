const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderItemSchema = new Schema({
    _id: ObjectId,
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    vendorAccess: Boolean,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    qty: {
        type: Number,
        default: 1
    },
    itemPrice: {
        amount: Number,
        discount: Number,
        margin: Number,
        net: Number,
        subtotal: Number,
        vendorSubtotal: Number,
        currencyCode: String
    },
    subTotal: {
        amount: Number,
        currencyCode: String
    },
    status: {
        available: Boolean,
        confirmed: Boolean,
        deleted: Boolean,
        statusDate: {
            type: Date,
            default: Date.now
        }, updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        confirmedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    messages: [{
        message: String,
        date: {
            type: Date,
            default: Date.now
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        forClient: Boolean
    }],
    serialNumber: Number

}, { collection: 'OrderItems' });


module.exports = OrderItem = mongoose.model("OrderItem", OrderItemSchema);