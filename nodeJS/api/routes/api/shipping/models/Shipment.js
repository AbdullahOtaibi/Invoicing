const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ShipmentSchema = new Schema({
    _id: ObjectId,
    serialNumber: Number,
    shipmentCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShippingCompany'
    },
    shipmentNumber: String,
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    insurance: {
        fileUrl: String,
        uploadFolder: String,
        insuranceDate: {
            type: Date,
            default: Date.now
        },
    },
    shippingAddress: {

    },
    factoryLoadingPhotos: [{
        url: String,
        uploadFolder: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        dateUploaded: {
            type: Date,
            default: Date.now
        }
    }],
    warehouseLoadingPhotos: [
        {
            url: String,
            uploadFolder: String,
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            dateUploaded: {
                type: Date,
                default: Date.now
            }
        }
    ],
   
    cmr: {
        url: String,
        uploadFolder: String,
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        dateUploaded: {
            type: Date,
            default: Date.now
        }
    },
    departurePhotos: [
        {
            url: String,
            uploadFolder: String,
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            dateUploaded: {
                type: Date,
                default: Date.now
            }
        }
    ],
    transitePhotos: [
        {
            url: String,
            uploadFolder: String,
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            dateUploaded: {
                type: Date,
                default: Date.now
            }
        }
    ],
    deliveryPhotos: [
        {
            url: String,
            uploadFolder: String,
            uploadedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            dateUploaded: {
                type: Date,
                default: Date.now
            }
        }
    ],
    
    
    
    startDate: {
        type: Date,
        default: Date.now
    }



}, { collection: 'Shipments' });


module.exports = Shipment = mongoose.model("Shipment", ShipmentSchema);