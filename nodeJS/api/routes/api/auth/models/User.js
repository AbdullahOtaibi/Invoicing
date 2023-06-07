const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Company = require('../../companies/models/Company');
const UserRole = require('../../users/models/UserRole');

const UserSchema = new Schema({
    _id: ObjectId,
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
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRole'
    }],
    active: Boolean,
    avatarUrl: String,
    emailConfirmed: Boolean,
    phone: String,
    firstName: String,
    surName: String,
    address: String,
    countryCode: String,
    otp: String
}, { collection: 'Users' });


module.exports = User = mongoose.model("User", UserSchema);