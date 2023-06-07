const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CategorySchema = new Schema({
    title: {
        english: String,
        arabic: String,
        turkish: String
    },
    alias: String,
    published: Boolean,
   
}, {collection:'ContentCategories'});


module.exports  = Category = mongoose.model("Category", CategorySchema);