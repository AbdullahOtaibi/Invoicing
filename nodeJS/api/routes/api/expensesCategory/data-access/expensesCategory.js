const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const expensesCategory = require('../models/expensesCategory');
const { query } = require('express');

function expensesCategoryMethod() {

  this.getExpensesCategoryById = async function (id) {
    let _expensesCategory = await expensesCategory.findOne({ _id: id, deleted: false })
    
    return _expensesCategory;
  }

}
module.exports = new expensesCategoryMethod();  