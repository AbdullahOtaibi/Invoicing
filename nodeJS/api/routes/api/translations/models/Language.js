const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LanguageSchema = new Schema({
    code: {
        type: String,
        unique: true
    },
    name: String,
    defaultFlagCode: String,
    localizedName: String,
    enabled: {
        type: Boolean,
        default: false
    }

}, { collection: 'Languages' });


module.exports = Language = mongoose.model("Language", LanguageSchema);
