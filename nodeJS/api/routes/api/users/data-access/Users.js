const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const User = require('../models/User');




function Users() {  

    this.getUserById = async function (userId){
        return await User.findOne({ _id: userId });
    }
}


module.exports = new Users();  