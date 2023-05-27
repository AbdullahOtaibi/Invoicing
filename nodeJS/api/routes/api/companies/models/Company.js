const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocalizedStringSchema = require('../../schemas/LocalizedString');



const AddressSchema = new Schema({
    addressLine1: String,
    addressLine2: String,
    countryCode: String,
    city: LocalizedStringSchema,
    country: {
        code: String,
        name: LocalizedStringSchema
    },
    location: {
        lng: Number,
        lat: Number
    } ,
   

});

const CompanySchema = new Schema({
    code: String,
    serialNumber: Number,
    name: LocalizedStringSchema,
    description: LocalizedStringSchema,
    logoUrl: String,
    showAsPartner: Boolean,
    profitPercentage: Number,
    address: AddressSchema,
    contactDetails: {
        phone: String,
        infoEmail: String,
        salesEmail: String,
        fax: String,
        facebook: String, 
        instagram: String,
        youtube: String,
        website: String
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    categories: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
    }],
    country:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    published: Boolean,
    notesFromCompany: String,
    companyInvoiceID:String, 
    incomeSourceSequence:String,
    invoiceCategory:String,
    clientId:String, 
    clientSecret:String,  
}, { collection: 'Companies' });


module.exports = Company = mongoose.model("Company", CompanySchema);