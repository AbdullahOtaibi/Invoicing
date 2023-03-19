const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ModuleSchema = new Schema({
    _id: ObjectId,
    code: String,
    name: {
        english: String,
        arabic: String,
        turkish: String
    },
    code: String,
    enabled: {
        type: Boolean,
        default: false
    },
    controllerPath: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    }


}, { collection: 'Modules' });


module.exports = Module = mongoose.model("Module", ModuleSchema);