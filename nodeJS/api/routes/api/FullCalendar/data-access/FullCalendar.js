const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const FullCalendar = require('../models/FullCalendar');
const { query } = require('express');




function CalendarEvents() {

  this.getFullCalendarById = async function (FullCalendarId) {
    let fullCalendar = await FullCalendar.findOne({ _id: FullCalendarId, deleted: false }).populate("user", "-password")
      
    return fullCalendar;
  }

}


module.exports = new CalendarEvents();  