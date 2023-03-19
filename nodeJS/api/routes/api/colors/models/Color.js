const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocalizedStringSchema = require('../../schemas/LocalizedString');



const ColorSchema = new Schema({
    name: LocalizedStringSchema,
    htmlCode: String
    
}, { collection: 'colors' });


module.exports = Color = mongoose.model("Color", ColorSchema);