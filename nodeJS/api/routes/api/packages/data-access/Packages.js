const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Package = require('../models/Package');
const { query } = require('express');

function Packages() {

  this.getPackageById = async function (PackageId) {
    let Package = await Contact.findOne({ _id: PackageId, deleted: false }).populate("user", "-password") 
    return Package;
  }

}
module.exports = new Packages();  