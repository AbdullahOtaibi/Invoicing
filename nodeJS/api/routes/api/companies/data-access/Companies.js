const mongoose = require('mongoose');
const Company = require('../models/Company');




function Companies() {  

    this.getCompanyById = async function (vendorId){
        return await Company.findOne({ _id: vendorId });
    }
}


module.exports = new Companies();  