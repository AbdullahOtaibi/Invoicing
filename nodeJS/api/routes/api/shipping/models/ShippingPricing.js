const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ShippingPricingSchema = new Schema({
    _id: ObjectId,
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingCompany'
    },
    date: {
        type: Date,
        default: Date.now
    },
    fullLandContainerPrice: {
        amount: Number,
        currencyCode: {
            type: String,
            default: 'USD'
        }
    },
    fullSeaContainerPrice: {
        amount: Number,
        currencyCode: {
            type: String,
            default: 'USD'
        }
    },
    fullAirContainerPrice: {
        amount: Number,
        currencyCode: {
            type: String,
            default: 'USD'
        }
    },

    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    
}, { collection: 'ShippingPricing' });

module.exports = ShippingPricing = mongoose.model("ShippingPricing", ShippingPricingSchema);