const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Contract = require('../models/Contract');
const { query } = require('express');

function Contracts() {

  this.getContractById = async function (receiptId) {
    let contract = await Contract.findOne({ _id: receiptId, deleted: false }).populate("client", "-password") 
    return contract;
  }

}
module.exports = new Contracts();  