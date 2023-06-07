const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TranslationSchema = new Schema({
    code: {
        type: String,
        unique: true
    },
    sections: [{
        name: String,
        entries: [
            {
                code: String,
                value: String
            }
        ]
    }]

}, { collection: 'Translations' });


module.exports = Translation = mongoose.model("Translation", TranslationSchema);
