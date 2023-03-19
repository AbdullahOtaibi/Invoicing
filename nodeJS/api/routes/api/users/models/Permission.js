const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PermissionSchema = new Schema({
    code: String,
    name: {
        english: String,
        arabic: String,
        turkish: String
    }

}, { collection: 'Permissions' });


module.exports = Permission = mongoose.model("Permission", PermissionSchema);