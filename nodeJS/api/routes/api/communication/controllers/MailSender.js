const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');
const nodemailer = require("nodemailer");
const config = require('config');
const MailTemplate = require('../models/MailTemplate');

const orders = require('../../orders/data-access/Orders');
const users = require('../../users/data-access/Users');
const companies = require('../../companies/data-access/Companies');
const MessageQueue = require('../models/MessageQueue')

const getParamValue = (paramPath, dataObject) => {
  return paramPath.split('.').reduce(
    function (memo, token) {
      return memo != null && memo[token];
    },
    dataObject
  );
}
const sendEmail = async (to, subject, body) => {

  let transporter = nodemailer.createTransport({
    host: config.get("mailServer"),
    port: config.get("mailPort"),
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.get("mailUser"), // generated ethereal user
      pass: config.get("mailPassword"), // generated ethereal password
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  let info = await transporter.sendMail({
    from: config.get("mailFrom"), // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: body, // html body
  });

}
// "/v1/mailer/send-order-message"
router.post('/send-order-message', verifyToken, async (req, res, next) => {
  let result = {};
  res.notify = {code: 'messages', extra: 'new-message'};
  let messageBody = req.body.messageBody || '';
  let receipient = '';
  let vendorId = req.body.vendorId || '';
  let clientId = req.body.clientId;
  let orderId = req.body.orderId;
  let subject = "website-domain Order Notification";
  let order = null;
  if (orderId) {
    order = await orders.getOrderById(orderId);
  }
  if (clientId) {
 //   console.log('clientId is valid :' + clientId);
    let client = await users.getUserById(clientId);
  //  console.log('client ');
  //  console.log(client);
    receipient = client.email;
    res.notify.userEmail = client.email;
  }
  if (vendorId) {
    console.log('vendorId is valid :' + vendorId);
    let vendor = await companies.getCompanyById(vendorId);
    if(vendor && vendor.contactDetails){
      receipient = vendor.contactDetails.infoEmail;
      console.log("receipient : " + receipient);
    }
    
  }

  if(order){
    console.log('order found')
    subject = "website-domain Order #" + ("000000".substring(("" + order.serialNumber).length) + order.serialNumber) + " Notification";
  }
   

  let newObject = new MessageQueue();
  newObject._id = new mongoose.Types.ObjectId();
  newObject.subject = subject;
  newObject.recipients = [];
  newObject.recipients.push(receipient);
  newObject.messageBody = messageBody;
  newObject.sent = false;
  newObject.order = orderId;
  newObject.client = clientId;
  newObject.sender = req.user.id;
  newObject.user = clientId;
  newObject.retries = 0;

  let savedMessage = await newObject.save();
  result.message = savedMessage;
  result.success = true;
  res.json(result);
  next();

});









module.exports = router;
