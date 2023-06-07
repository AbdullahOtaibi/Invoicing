const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const LocalizedStringSchema = require('../../schemas/LocalizedString');
const ProductOption = require('./ProductOption')

const ProductOptionsGroupSchema = new Schema({
    _id: ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    options:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductOption'
    }],
    name:{
        english: String,
        arabic: String,
        turkish: String
    },
    maximumNumberOfAllowedOptions: {
        type:Number,
        default:1
    },
    minimumNumberOfAllowedOptions:{
        type: Number,
        default: 1
    }
}, { collection: 'ProductOptionsGroups' });


module.exports = ProductOptionsGroup = mongoose.model("ProductOptionsGroup", ProductOptionsGroupSchema);