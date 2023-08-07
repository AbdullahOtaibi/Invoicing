const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Subscription = require('../models/Subscription');
const { query } = require('express');

function Subscriptions() {

  this.getSubscriptionById = async function (receiptId) {
    let subscription = await Subscription.findOne({ _id: receiptId, deleted: false }).populate("client", "-password") 
    return subscription;
  }

}
module.exports = new Subscriptions();  