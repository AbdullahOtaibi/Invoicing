const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Contract = require('../models/Contract');
const Invoice = require('../../invoices/models/Invoice');
const Receipt = require('../../receipt/models/Receipt');
const { query } = require('express');

function Contracts() {

  this.getContractById = async function (receiptId) {
    let contract = await Contract.findOne({ _id: receiptId, deleted: false }).populate("contact", "-password")
    return contract;
  }

  this.getContractsByContactId = async function (contactId) {
    let contract = await Contract.find({ contact: contactId, deleted: false }).populate("contact", "-password")
    return contract;
  }

}
module.exports = new Contracts();  