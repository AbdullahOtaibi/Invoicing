const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocalizedStringSchema = new Schema({
    english: String,
    arabic: String,
    turkish: String
});

module.exports = LocalizedStringSchema;