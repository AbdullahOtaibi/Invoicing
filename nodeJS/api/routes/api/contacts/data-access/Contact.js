const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const Contact = require('../models/Contact');
const { query } = require('express');

function ContactEvents() {

  this.getContactById = async function (ContactId) {
    let Contact = await Contact.findOne({ _id: ContactId, deleted: false }).populate("user", "-password")
      
    return Contact;
  }

}
module.exports = new ContactEvents();  