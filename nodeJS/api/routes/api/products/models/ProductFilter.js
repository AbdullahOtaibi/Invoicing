const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const ObjectId = Schema.ObjectId;
const LocalizedStringSchema = require('../../schemas/LocalizedString');

const ProductFilterSchema = new Schema({
    _id:ObjectId,
    name: LocalizedStringSchema,
    published: Boolean,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
    },


}, { collection: 'ProductFilters' });

module.exports  = ProductFilter = mongoose.model("ProductFilter", ProductFilterSchema);