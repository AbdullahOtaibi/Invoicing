const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const NavigationMenuItem = require('./NavigationMenuItem')


const NavigationMenuSchema = new Schema({
    _id: ObjectId,
    code: String,
    title:{
        english: String,
        arabic: String,
        turkish: String
    },
    published: Boolean,
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NavigationMenuItem'
    }],
    cssClassName: String
    
   
}, {collection:'NavigationMenus'});


module.exports  = NavigationMenu = mongoose.model("NavigationMenu", NavigationMenuSchema);