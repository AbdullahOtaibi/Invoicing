const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const LocalizedStringSchema = require('../../schemas/LocalizedString');

const ProductCategorySchema = new Schema({
    _id: ObjectId,
    serialNumber: Number,
    name: LocalizedStringSchema,
    urlKey: String,
    icon: String,
    imageUrl: String,
    articleAlias: String,
    image: {
        uploadFolder: String,
        thumbnailUrl: String,
        url: String
    },
    parentId: Number,
    showInFilters: Boolean,
    published: Boolean,
    deleted: Boolean,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
    },
    parents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
    }],
    filters: [
        {
            _id: ObjectId,

            name: {
                english: String,
                arabic: String,
                turkish: String
            }
        }
    ],
    description: {
        english: String,
        arabic: String,
        turkish: String
    },
    keywords: {
        english: String,
        arabic: String,
        turkish: String
    },
    level: Number


}, { collection: 'ProductCategories' });

module.exports = ProductCategory = mongoose.model("ProductCategory", ProductCategorySchema); 