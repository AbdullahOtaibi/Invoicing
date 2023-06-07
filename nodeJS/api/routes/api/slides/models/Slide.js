const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SlideSchema = new Schema({
    _id: ObjectId,
    title:{
        english: String,
        arabic: String,
        turkish: String
    },
    imageUrl: String,
    published: Boolean,
    dateAdded: {
        type: Date,
        default: Date.now
    }
   

}, { collection: 'Slides' });


module.exports = Slide = mongoose.model("Slide", SlideSchema);