const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const MailTemplateSchema = new Schema({
    _id: {
        type: ObjectId,
        default: new mongoose.Types.ObjectId()

    },
    code: String,
    subject: {
        english: String,
        arabic: String,
        turkish: String
    },
    content: {
        english: String,
        arabic: String,
        turkish: String
    },
    parameters:
        [{
            name: String,
            path: {
                english: String,
                arabic: String,
                turkish: String
            }
        }]


}, { collection: 'MailTemplates' });



module.exports = MailTemplate = mongoose.model("MailTemplate", MailTemplateSchema);