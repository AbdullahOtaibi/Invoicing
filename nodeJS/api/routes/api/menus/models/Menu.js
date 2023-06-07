const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const MenuItemSchema = require('./MenuItem')



const MenuItemSchema = new Schema({
    id: Number,
    title: String,
    titleArabic: String,
    published: Boolean,
    link: String,
    icon: String,
    order: Number,
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    childs:[] 
    
   
});

const MenuSchema = new Schema({
    id: Number,
    code: String,
    title: String,
    titleArabic: String,
    published: Boolean,
    items:[MenuItemSchema]
    
   
}, {collection:'menu'});


module.exports  = Menu = mongoose.model("Menu", MenuSchema);