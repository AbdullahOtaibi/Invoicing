const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const LocalizedStringSchema = require('../../schemas/LocalizedString');

const ProductCategorySchema = new Schema({
    _id: Number,
    name: LocalizedStringSchema,
    icon: String,
    parentId: Number,
    active: Boolean


});

const ProductOptionSchema = new Schema({
    _id: Number,
    description: LocalizedStringSchema,
    cost: Number,
    selected: Boolean
});

const ProductOptionGroupSchema = new Schema({
    _id: Number,
    description: LocalizedStringSchema,
    minimumAllowed: Number,
    maximumAllowed: Number,
    sortOrder: Number,
    options: [ProductOptionSchema]

});

const ProductImageSchema = new Schema({
    uploadFolder: String,
    thumbnailUrl: String,
    url: String
});



const ProductSchema = new Schema({
    _id: ObjectId,
    serialNumber: Number,
    alias: String,
    code: String,
    sku: String,
    shopId: Number,
    discountPercentage: Number,
    name: LocalizedStringSchema,
    description: LocalizedStringSchema,
    type: LocalizedStringSchema,
    tags: [String],
    images: [ProductImageSchema],
    video: {
        url: String,
        thumbnailUrl: String
    },
    image: String,
    minimumOrderQty: Number,
    price: {
        amount: Number,
        currencyCode: String
    },
    sellingPrice: {
        amount: Number,
        currencyCode: String
    },
    unitPrice: {
        amount: Number,
        currencyCode: String
    },
    published: Boolean,
    approved: Boolean,
    quotationOnly: Boolean,
    availableInStock: Boolean,
    options: [ProductOptionGroupSchema],
    relatedProducts: [Number],
    minimumQuantity: Number,
    color: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
    }],
    vendorId: ObjectId, 
    dateAdded: {
        type: Date,
        default: Date.now
    },
    priceCalc: String,
    packaging: {
        length: Number,
        width: Number,
        height: Number,
        weight: Number,
        numberOfUnits: Number,
        stacking: String,
        maxStacking: Number
    },
    relatedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    filters: [ObjectId],
    attachments: [{
        url: String,
        description: {
            english: String,
            arabic: String,
            turkish: String
        }
    }],
    productVariants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    mainProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    offers: {
        quantityBased: [{
            _id: {
                type: ObjectId,
                default: new mongoose.Types.ObjectId()

            },
            minQty: Number,
            maxQty: Number,
            price: {
                amount: Number,
                currencyCode: String
            }
        }]
    },
    keywords: {
        english: String,
        arabic: String,
        turkish: String
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
        weight: Number,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    brand: String,
    legacyCategoryName: String



}, { collection: 'Products' });


module.exports = Product = mongoose.model("Product", ProductSchema);