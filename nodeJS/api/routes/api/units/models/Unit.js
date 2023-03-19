const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UnitSchema = new Schema({
    name: {
        english: String,
        arabic: String,
        turkish: String
    }
}, { collection: 'Units' });

module.exports = Unit = mongoose.model("Unit", UnitSchema);