const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const ShippingCompany = require('../models/ShippingCompany');

router.get('/all', (req, res) => {
    ShippingCompany.find({})
        .sort({ id: 1 })
        .then(items => {
            res.json(items);
        });
});

router.get('/get/:id', (req, res) => {
    ShippingCompany.findOne({ _id: req.params.id })
        .then(items => {
            res.json(items);
        });
});


router.post('/create', verifyToken, (req, res) => {
    const newObject = new ShippingCompany({
        ...req.body,
        
    });
    newObject._id = new mongoose.Types.ObjectId();
    newObject.save().then(createdObject => {

        console.log('saved into database...');
        res.json(createdObject);
    }).catch(e => {
        console.log('cannot save into database', e.message);
        res.json(e);
    });
});

router.post('/update', verifyToken, (req, res) => {
    //console.log("updating product...");
   //console.log(req.user);
    
    // if (req.user.vendorId && req.user.role != "Administrator") {
    //     req.body.vendorId = req.user.vendorId;
    //     req.body.vendor = req.user.vendorId;
    // }

   
    ShippingCompany.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
        console.log('saved into database...');


    }).then(() => {
        ShippingCompany.findOne({ _id: req.body._id })
            .sort({ id: 1 })
            .then(item => {
                res.json(item);
            });
    })
});


module.exports = router;