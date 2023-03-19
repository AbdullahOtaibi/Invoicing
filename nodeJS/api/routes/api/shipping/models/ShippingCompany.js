const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ShippingCompanySchema = new Schema({
    _id: ObjectId,
    published: Boolean,
    name: {
        english: String,
        arabic: String,
        turkish: String
    },
    landTransportationPricing: {
        eta: String,
        optionAvailable: Boolean,
        stackable: {
            cpm: Number,
            mt: Number
        },
        nonStackable: {
            cpm: Number,
            mt: Number
        },
        fullLandContainerPrice: [{
            date: {
                type: Date,
                default: Date.now
            },
            amount: Number,
            currencyCode: String,
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }]
    },
    seaTransportationPricing: {
        optionAvailable: Boolean,
        eta: String,
        stackable: {
            cpm: Number,
            mt: Number
        },
        nonStackable: {
            cpm: Number,
            mt: Number
        },
        fullSeaContainerPrice: [{
            date: {
                type: Date,
                default: Date.now
            },
            amount: Number,
            currencyCode: String,
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }]
    },
    airTransportationPricing: {
        optionAvailable: Boolean,
        eta: String,
        stackable: {
            cpm: Number,
            mt: Number
        },
        nonStackable: {
            cpm: Number,
            mt: Number
        }
    }




}, { collection: 'ShippingCompanies' });


module.exports = ShippingCompany = mongoose.model("ShippingCompany", ShippingCompanySchema);