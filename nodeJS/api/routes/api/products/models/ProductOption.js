const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const LocalizedStringSchema = require('../../schemas/LocalizedString');


const ProductOptionSchema = new Schema({
    _id: ObjectId,
    optionsGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductOptionsGroups'
    },
    name:{
        english: String,
        arabic: String,
        turkish: String
    },
    price: {
        amount: Number,
        currencyCode: String
    }
    
}, { collection: 'ProductOptions' });


module.exports = ProductOption = mongoose.model("ProductOption", ProductOptionSchema);