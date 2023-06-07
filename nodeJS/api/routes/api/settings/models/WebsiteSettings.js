const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const WebsiteSettingsSchema = new Schema({
    id: Number,
    code: String,
    title: { 
        english: String,
        arabic: String,
        turkish: String
    },
    address: { 
        english: String,
        arabic: String,
        turkish: String
    },
    facebookUrl: String,
    twitterUrl: String,
    instagramUrl: String,
    youtubeUrl: String,
    blogUrl: String,
    infoEmail: String,
    published: Boolean,
    phone: String,
    mobile: String,
    
    keywords: { 
        english: String,
        arabic: String,
        turkish: String
    },
    description: { 
        english: String,
        arabic: String,
        turkish: String
    },
    exchangeRates:{
        usdToKwd: Number,
        tryToKwd: Number
    }
}, {collection:'Settings'});


module.exports  = WebsiteSettings = mongoose.model("WebsiteSettings", WebsiteSettingsSchema);