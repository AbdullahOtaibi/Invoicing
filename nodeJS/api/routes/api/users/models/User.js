const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserRole = require('./UserRole');


const UserSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    registerDate: {
        type: Date,
        default: Date.now
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    shippingCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShipmentCompany'
    },
    avatarUrl: String,
    otp: String,
    emailConfirmed: Boolean,
    phone: String,
    firstName: String,
    surName: String,
    address: String,
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRole'
    }],
    active: Boolean,
    countryCode: String
}, { collection: 'Users' });


module.exports = User = mongoose.model("User", UserSchema);