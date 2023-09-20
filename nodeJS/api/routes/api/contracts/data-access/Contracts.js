const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Contract = require('../models/Contract');
const Invoice = require('../../invoices/models/Invoice');
const Receipt = require('../../receipt/models/Receipt');
const { query } = require('express');

function Contracts() {

  this.getContractById = async function (id) {
    let contract = await Contract.findOne({ _id: id, deleted: false })
      .populate("contact", "-password")
      .populate("package");
    let contractInvoices = await Invoice.find({ contract: id, deleted: false });
    let contractReceipts = await Receipt.find({ contract: id, deleted: false });
    if (contractInvoices) {
      let totalInvoiced = 0;
      contractInvoices.forEach((invoice) => {
        totalInvoiced += invoice.legalMonetaryTotal.taxInclusiveAmount;
      });
      contract.contractTotalInvoiced = totalInvoiced;
    }
    if(contractReceipts){
      let totalReceipted = 0;
      contractReceipts.forEach((receipt) => {
        totalReceipted += receipt.receiptAmount;
      });
      contract.contractTotalReceipts = totalReceipted;
    }
    return contract;
  }

  this.getContractsByContactId = async function (contactId) {
    let contract = await Contract.find({ contact: contactId, deleted: false }).populate("client", "-password")
    return contract;
  }

}
module.exports = new Contracts();  