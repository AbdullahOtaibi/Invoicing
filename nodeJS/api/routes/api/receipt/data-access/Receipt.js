const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Receipt = require('../models/Receipt');
const { query } = require('express');

function Receipts() {

  this.getReceiptById = async function (receiptId) {
    let receipt = await Contact.findOne({ _id: receiptId, deleted: false }).populate("user", "-password") 
    return receipt;
  }

}
module.exports = new Receipts();  