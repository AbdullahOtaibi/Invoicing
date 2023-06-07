const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const ShippingAddressSchema = new Schema({
    _id: ObjectId,
    client: {
        type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    },
    description: String,
    fullName: String,
    addressLine1: String,
    addressLine2: String,
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    city: String,
    phoneNumber: String

}, { collection: 'ShippingAddresses' })
module.exports = ShippingAddress = mongoose.model("ShippingAddress", ShippingAddressSchema);