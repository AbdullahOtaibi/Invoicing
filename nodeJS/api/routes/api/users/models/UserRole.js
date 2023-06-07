const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Permission = require('./Permission');

const UserRoleSchema = new Schema({
    
    name: {
        english: String,
        arabic: String,
        turkish: String
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
   
}, {collection:'UserRoles'});


module.exports = UserRole = mongoose.model("UserRole", UserRoleSchema);