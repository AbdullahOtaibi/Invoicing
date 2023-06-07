const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../../utils/auth');

const ShippingAddress = require('../models/ShippingAddress');

///v1/shipments/addresses
router.get('/get/:id', (req, res) => {
    ShippingAddress.findOne({ _id: req.params.id })
        .then(item => {
            res.json(item);
        });
});

router.get('/savedAddresses', verifyToken, async (req, res) => {
    ShippingAddress.find({ client: req.user.id })
        .then(items => {
            res.json(items);
        });
});


router.post('/create', verifyToken, (req, res) => {
    const newObject = new ShippingAddress({
        ...req.body,
        client: req.user.id
    });
    newObject._id = new mongoose.Types.ObjectId();
    newObject.save().then(createdObject => {
        createdObject._id = newObject._id;
        console.log('saved into database...');
        res.json(createdObject);
    }).catch(e => {
        console.log('cannot save into database', e.message);
        res.json(e);
    });
});

router.post('/update', verifyToken, (req, res) => {
    console.log('update Slide called...');
    console.log(req.body);
    ShippingAddress.findByIdAndUpdate(req.body._id, req.body, function (err, item) {
        console.log('saved into database...');
        res.json(item);
    })


});


module.exports = router;