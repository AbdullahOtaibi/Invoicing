const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const InvoiceSchema = new Schema({
    _id: ObjectId,
    invoiceUUID: String,
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
            telephone: String
        },
    },

    partyIdentification: {
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
    invoiceLines: [{

        iD: String,
        invoicedQuantity: String,
        lineExtensionAmount: String,
        itemName: String,
        price: {
            priceAmount: Number,
            allowanceCharge: {
                chargeIndicator: {
                    type: Boolean,
                    default: false
                },
                allowanceChargeReason: {
                    type: String,
                    default: "DISCOUNT"
                },
                amount: Number
            }
        }

    }],








    serialNumber: Number,
    notesforClient: String,
    orderNumber: String,
    deleted: Boolean,

    totalAmount: {
        amount: Number,
        vendorAmount: Number,
        currencyCode: String
    },

    user: {
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
        ref: 'InvoiceStatus'
    },

  





}, { collection: 'Invoices' });


module.exports = Invoice = mongoose.model("Invoice", InvoiceSchema);