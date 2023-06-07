const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const  ObjectId = Schema.ObjectId;

const CategorySchema = new Schema({
    id:Number,
    title: String,
    titleArabic: String,
    alias: String,
});

const LinkSchema = new Schema({
    text: String,
    textArabic: String,
    url: String,
});

const ImageSchema = new Schema({
    url: String,
    title: String,
    titleArabic: String,
    brief: String,
    briefArabic: String,
    link: String
});


const ArticleSchema = new Schema({
    _id:ObjectId,
    title: {
        english: String,
        arabic: String,
        turkish: String
    },
   
    brief: {
        english: String,
        arabic: String,
        turkish: String
    },
   
    alias: String,
    note: String,
    dateCreated: Date,
    dateModified: Date,
    published: Boolean,
    createdBy: String,
    content: {
        english: String,
        arabic: String,
        turkish: String
    },
    images: [ImageSchema],
    link: LinkSchema,   
    category: CategorySchema,
    author: {
        english: String,
        arabic: String,
        turkish: String
    },
   
    hits: Number,
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
    showTitle: Boolean
   
}, {collection:'Articles'});


module.exports  = Article = mongoose.model("Article", ArticleSchema);