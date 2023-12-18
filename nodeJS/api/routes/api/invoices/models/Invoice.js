const number_format = require('locutus/php/strings/number_format');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const InvoiceSchema = new Schema({
    _id: ObjectId,
    subscription: {
        type: ObjectId,
        ref: 'Subscription'
    },
    invoiceSequance:String, 
    invoiceUUID: String,
    ObjectIdReceipt:ObjectId,

    incomeSourceSequence: String,
    invoiceCategory: String,
    issuedDate: Date,
    invoiceTypeCode: String,

    invoiceType: String,

    currencyCode: String,
    additionalDocumentReference:
    {
        id: String,
        uuid: String
    },
    accountingSupplierParty:
    {
        postalAddress:
        {
            identificationCode: String,
        },
        partyTaxScheme:
        {
            companyID: String,
            taxSchemeId: {
                type: String,
                default: "VAT"
            },
            registrationName: String,
        }
       
    },
   
    accountingCustomerParty:
    {
        partyIdentification: {
            schemeID: {
                type: String,
                default: "NIN"
            },
            value: String
        },
        // setting on user level 
        postalAddress: {
            postalZone: String,
            countrySubentityCode: String
        },
        taxSchemeId: {
            type: String,
            default: "VAT"
            
        },
        registrationName: String,
        telephone: String
    },
    sellerSupplierPartyIdentification: {
        id: String
    },

    allowanceCharge:
    {

        chargeIndicator:
        {
            type: Boolean,
            default: false,
        },
        allowanceChargeReason: String,
        amount: {
            type: Number,
            default: 0.000,
        }

    },
    legalMonetaryTotal: {
        taxExclusiveAmount: Number,
        taxInclusiveAmount: Number,
        allowanceTotalAmount: Number,
        payableAmount: Number
    },
    items: [{

        id: Number,
        sequance:Number, 
        unitPrice:Number,
        qty:Number, 
        allowance:Number, 
        lineExtensionAmount:Number, 
        itemName: String,
        chargeIndicator: 
        {
            type:Boolean, 
            default:false 
        }, 
        allowanceChargeReason: {
            type: String,
            default: "DISCOUNT"
        }
    }],
    deleted: {
        type:Boolean,
        default:false
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
   contact:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    contactType:{ 
        type: String,
        ref: 'Contact'
    },
    contract: {
        type: ObjectId,
        ref: "Contract" 
    } ,
    package: {
        type: ObjectId,
        ref: "Package"    
    }, 
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    } ,
    postedXML: String, 
    responseXML:String, 
    createdDate: {
        type: Date,
        default: Date.now
    }, 
    updatedDate: Date,
    serialNumber: Number ,
    seqNumber: String ,
    docNumber: String ,
    status:{
        type:String, 
        default: "new" 
    },
    note:String, 
    postedXML:String, 
    encryptPostedXML: String,
    responseXML: String ,
    developerCommnet: String,
    AdditionalDocumentReference_uuid_Type_Reverted:String,
    isPosted:Boolean,
    revertedXML:String, 
    encrypRevertedXML:String,
    revertedXMLResponse:String, 
    RevertedDate:Date ,
    paymentMethod: String, 
    insurance:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contact'
    },
    templateNo:String, 
    percentageOfCover: Number, 

}, { collection: 'Invoices' });


module.exports = Invoice = mongoose.model("Invoice", InvoiceSchema);