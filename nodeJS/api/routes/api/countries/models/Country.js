const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LocalizedStringSchema = require('../../schemas/LocalizedString');




const CountriesSchema = new Schema({
    name:  LocalizedStringSchema,
    code: String
    
}, {collection:'Countries'});


module.exports = Country = mongoose.model("Country", CountriesSchema);