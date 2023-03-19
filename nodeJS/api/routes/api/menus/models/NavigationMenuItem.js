const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const NavigationMenuItemSchema = new Schema({
    _id: {
        type: ObjectId,
        default: new mongoose.Types.ObjectId()

    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NavigationMenu'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NavigationMenuItem'
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NavigationMenuItem'
    }],
    title:{
        english: String,
        arabic: String,
        turkish: String
    },
    published: Boolean,
    link: String,
    icon: String,
    order: Number,
    target:{
        type: String,
        default:'self'
    }    
   
}, {collection:'NavigationMenuItems'});



module.exports  = NavigationMenuItem = mongoose.model("NavigationMenuItem", NavigationMenuItemSchema);