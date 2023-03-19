const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyToken =  require('../../utils/auth');

const WebsiteSettings = require('../models/WebsiteSettings');

router.get('/all', (req, res) => {
    WebsiteSettings.find()
    .sort( {id: 1})
    .then(item => {
        res.json(item[0]);
    });
});

router.post('/update', verifyToken, (req, res) => {
       console.log(req.body);
    WebsiteSettings.findByIdAndUpdate(req.body._id, req.body, function (err, item){
        console.log('saved into database...');
        res.json(item);
    })
   
 
});

module.exports = router;