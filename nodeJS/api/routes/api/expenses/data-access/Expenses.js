const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Expenses = require('../models/Expenses');
const { query } = require('express');

function Expenses() {

  this.getExpenseById = async function (id) {
    
    let Expense = await Expenses.findOne({ _id: id, deleted: false })
    return Expense;
  }
/*
  this.getContractsByContactId = async function (contactId) {
    let contract = await Contract.find({ contact: contactId, deleted: false }).populate("client", "-password")
    return contract;
  }
  */

}
module.exports = new Expenses();  